import { DDDError } from "#/errors/ddd-error.js";
import type { DomainEvent } from "./domain-event.js";

export type DomainEventClass<D extends DomainEvent = DomainEvent> =
	abstract new (
		...args: never[]
	) => D;

export type DomainEventListener<D extends DomainEvent = DomainEvent> = (
	domainEvent: D,
) => void | Promise<void>;

export class DomainEventBus {
	private readonly handlers = new Map<
		DomainEventClass,
		Set<DomainEventListener>
	>();

	public clearHandlers() {
		this.handlers.clear();
	}

	public isHandlerSubscribed<D extends DomainEvent>(
		eventClass: DomainEventClass<D>,
		handler: DomainEventListener<D>,
	) {
		return (
			this.handlers.get(eventClass)?.has(handler as DomainEventListener) ??
			false
		);
	}

	public register<D extends DomainEvent>(
		eventClass: DomainEventClass<D>,
		handler: DomainEventListener<D>,
	) {
		const handlers =
			this.handlers.get(eventClass) ?? new Set<DomainEventListener<D>>();

		handlers.add(handler);

		this.handlers.set(eventClass, handlers as Set<DomainEventListener>);

		return this.unregister.bind(
			this,
			eventClass,
			handler as DomainEventListener,
		);
	}

	public unregister<D extends DomainEvent>(
		eventClass: DomainEventClass<D>,
		handler: DomainEventListener<D>,
	) {
		const handlers = this.handlers.get(eventClass);

		if (!handlers) {
			return;
		}

		handlers.delete(handler as DomainEventListener);

		if (handlers.size === 0) {
			this.handlers.delete(eventClass);
		}
	}

	public async dispatch(domainEvent: DomainEvent) {
		const handlers = this.handlers.get(
			domainEvent.constructor as DomainEventClass,
		);

		if (!handlers || handlers.size === 0) {
			return;
		}

		const results = await Promise.allSettled(
			Array.from(handlers, async (handler) => await handler(domainEvent)),
		);

		const errors = results.flatMap((result) =>
			result.status === "rejected" ? [result.reason] : [],
		);

		if (errors.length > 0) {
			throw new DDDError("DOMAIN_EVENT_DISPATCH_FAILED", {
				params: {
					event: domainEvent.constructor.name,
					count: errors.length,
				},
				cause: new AggregateError(errors, "Handlers falharam."),
			});
		}
	}

	public async dispatchAll(domainEvents: Iterable<DomainEvent>) {
		const results = await Promise.allSettled(
			Array.from(
				domainEvents,
				async (domainEvent) => await this.dispatch(domainEvent),
			),
		);

		const failures = results.flatMap((result) =>
			result.status === "rejected" ? [result.reason] : [],
		);

		if (failures.length > 0) {
			throw new DDDError("DOMAIN_EVENTS_DISPATCH_FAILED", {
				params: {
					count: failures.length,
				},
				cause: new AggregateError(failures, "Falha ao despachar eventos."),
			});
		}
	}
}
