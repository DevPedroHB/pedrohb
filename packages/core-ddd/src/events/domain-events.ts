import type { Aggregate } from "@/entities/aggregate";
import type { UniqueEntityId } from "@/entities/unique-entity-id";
import type { DomainEvent } from "./domain-event";

/**
 * Tipo utilitário que representa o construtor de um `DomainEvent`.
 */
export type EventConstructor<T extends DomainEvent> = new (...args: any[]) => T;

/**
 * Mecanismo central de gerenciamento e despacho de eventos de domínio.
 */
export class DomainEvents {
	private static handlers = new Map<
		Function,
		Array<(event: DomainEvent) => void>
	>();
	private static markedAggregates = new Map<string, Aggregate<any>>();
	/**
	 * Indica se os eventos devem ser despachados. Útil para testes.
	 */
	public static shouldRun = true;

	/**
	 * Marca um aggregate para despacho posterior dos eventos de domínio.
	 * @param aggregate O aggregate que contém eventos de domínio a serem despachados.
	 */
	public static markAggregateForDispatch(aggregate: Aggregate<any>) {
		const key = aggregate.id.toValue();

		if (!this.markedAggregates.has(key)) {
			this.markedAggregates.set(key, aggregate);
		}
	}

	/**
	 * Despacha os eventos do aggregate correspondente ao ID fornecido.
	 * @param id O identificador único do aggregate.
	 */
	public static dispatchEventsForAggregate(id: UniqueEntityId) {
		const key = id.toValue();
		const aggregate = this.markedAggregates.get(key);

		if (aggregate) {
			this.dispatchAggregateEvents(aggregate);

			aggregate.clearEvents();

			this.markedAggregates.delete(key);
		}
	}

	/**
	 * Despacha todos os eventos de todos os aggregates marcados.
	 */
	public static dispatchAll() {
		for (const aggregate of this.markedAggregates.values()) {
			this.dispatchAggregateEvents(aggregate);

			aggregate.clearEvents();
		}

		this.markedAggregates.clear();
	}

	/**
	 * Registra um handler para um tipo específico de evento de domínio.
	 * @template T Tipo do evento de domínio.
	 * @param eventClass A classe do evento a ser tratado.
	 * @param callback Função a ser executada quando o evento for despachado.
	 */
	public static registerHandler<T extends DomainEvent>(
		eventClass: EventConstructor<T>,
		callback: (event: T) => void | Promise<void>,
	) {
		const handlers = this.handlers.get(eventClass) ?? [];

		handlers.push((event: DomainEvent) => {
			if (event instanceof eventClass) {
				const result = callback(event as T);

				if (result instanceof Promise) {
					result.catch((error) =>
						console.error(`Error handling ${eventClass.name}:`, error),
					);
				}
			}
		});

		this.handlers.set(eventClass, handlers);
	}

	/**
	 * Remove todos os handlers registrados.
	 */
	public static clearHandlers() {
		this.handlers.clear();
	}

	/**
	 * Remove todos os aggregates marcados para despacho.
	 */
	public static clearMarkedAggregates() {
		this.markedAggregates.clear();
	}

	/**
	 * Despacha todos os eventos de um aggregate específico.
	 * @param aggregate O aggregate cujos eventos serão despachados.
	 */
	private static dispatchAggregateEvents(aggregate: Aggregate<any>) {
		if (!this.shouldRun) return;

		for (const event of aggregate.domainEvents) {
			this.dispatch(event);
		}
	}

	/**
	 * Despacha um único evento de domínio para todos os handlers registrados.
	 * @param event O evento de domínio a ser despachado.
	 */
	private static dispatch(event: DomainEvent) {
		if (!this.shouldRun) return;

		for (const [ctor, fns] of this.handlers.entries()) {
			if (event instanceof (ctor as any)) {
				for (const fn of fns) {
					fn(event);
				}
			}
		}
	}
}
