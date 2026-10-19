/** biome-ignore-all lint/suspicious/noExplicitAny: off */

import { DDDError } from "#/errors/ddd-error.js";
import type { DomainEvent } from "./domain-event.js";
import type { DomainEventPublisher } from "./domain-event-publisher.js";

export type DomainEventClass<D extends DomainEvent = DomainEvent> = new (
	...args: never[]
) => D;

export type DomainEventListener<D extends DomainEvent = DomainEvent> = (
	domainEvent: D,
) => void | Promise<void>;

export type DispatchMode = "parallel" | "serial";

export type DomainEventBusOptions = {
	dispatchMode?: DispatchMode;
};

export class DomainEventBus implements DomainEventPublisher {
	private readonly handlers = new Map<
		DomainEventClass<any>,
		Set<DomainEventListener<any>>
	>();
	private readonly dispatchMode: DispatchMode;

	public constructor({
		dispatchMode = "parallel",
	}: DomainEventBusOptions = {}) {
		this.dispatchMode = dispatchMode;
	}

	private handlersFor<D extends DomainEvent>(
		eventClass: DomainEventClass<D>,
	): Set<DomainEventListener<D>> | undefined {
		return this.handlers.get(eventClass) as
			| Set<DomainEventListener<D>>
			| undefined;
	}

	private async run(handlers: DomainEventListener[], domainEvent: DomainEvent) {
		const errors: unknown[] = [];

		if (this.dispatchMode === "serial") {
			for (const handler of handlers) {
				try {
					await handler(domainEvent);
				} catch (error) {
					errors.push(error);
				}
			}

			return errors;
		}

		const results = await Promise.allSettled(
			handlers.map(async (handler) => await handler(domainEvent)),
		);

		return results.flatMap((result) =>
			result.status === "rejected" ? [result.reason] : [],
		);
	}

	public clearHandlers() {
		this.handlers.clear();
	}

	public isHandlerSubscribed<D extends DomainEvent>(
		eventClass: DomainEventClass<D>,
		handler: DomainEventListener<D>,
	) {
		return this.handlersFor(eventClass)?.has(handler) ?? false;
	}

	public register<D extends DomainEvent>(
		eventClass: DomainEventClass<D>,
		handler: DomainEventListener<D>,
	) {
		const handlers =
			this.handlersFor(eventClass) ?? new Set<DomainEventListener<D>>();

		handlers.add(handler);

		this.handlers.set(eventClass, handlers);

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
		const handlers = this.handlersFor(eventClass);

		if (!handlers) {
			return;
		}

		handlers.delete(handler);

		if (handlers.size === 0) {
			this.handlers.delete(eventClass);
		}
	}

	public async dispatch(domainEvent: DomainEvent) {
		const handlers = Array.from(
			this.handlersFor(domainEvent.constructor as DomainEventClass) ?? [],
		);

		if (handlers.length === 0) {
			return;
		}

		const errors = await this.run(handlers, domainEvent);

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
		const failures: unknown[] = [];

		if (this.dispatchMode === "serial") {
			for (const domainEvent of domainEvents) {
				try {
					await this.dispatch(domainEvent);
				} catch (error) {
					failures.push(error);
				}
			}
		} else {
			const results = await Promise.allSettled(
				Array.from(
					domainEvents,
					async (domainEvent) => await this.dispatch(domainEvent),
				),
			);

			failures.push(
				...results.flatMap((result) =>
					result.status === "rejected" ? [result.reason] : [],
				),
			);
		}

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
