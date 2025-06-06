import type { DomainEvent } from "@/events/domain-event";
import { DomainEvents } from "@/events/domain-events";
import { Entity } from "./entity";

/**
 * Representa um agregado de domínio, que é uma entidade raiz que gerencia um conjunto de objetos relacionados
 * e encapsula regras de consistência. Pode gerar e armazenar eventos de domínio.
 * @template T Tipo das propriedades que compõem a entidade agregada.
 */
export abstract class Aggregate<T extends object> extends Entity<T> {
	/** Conjunto de eventos de domínio associados ao agregado. */
	public readonly domainEvents: Set<DomainEvent> = new Set();

	/**
	 * Adiciona um evento de domínio ao agregado e marca-o para despacho.
	 * @param domainEvent Evento de domínio a ser adicionado.
	 */
	protected addDomainEvent(domainEvent: DomainEvent): void {
		this.domainEvents.add(domainEvent);

		DomainEvents.markAggregateForDispatch(this);
	}

	/**
	 * Limpa todos os eventos de domínio armazenados neste agregado.
	 */
	public clearEvents(): void {
		this.domainEvents.clear();
	}

	/**
	 * Retorna uma representação com hash do agregado, útil para logs ou cache.
	 * @returns String representando o agregado com base no nome da classe e ID.
	 */
	public toHash(): string {
		return `[${Aggregate.name}@${this.constructor.name}]:${this.id.toValue()}`;
	}
}
