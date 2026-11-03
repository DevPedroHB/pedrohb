/** biome-ignore-all lint/suspicious/noExplicitAny: off */

import { DDDError } from "#/errors/ddd-error.js";
import type { DomainEvent } from "./domain-event.js";
import type { DomainEventPublisher } from "./domain-event-publisher.js";

export interface DomainEventClass<D extends DomainEvent = DomainEvent> {
	readonly type: string;
	new (...args: never[]): D;
}

export type DomainEventListener<D extends DomainEvent = DomainEvent> = (
	domainEvent: D,
) => void | Promise<void>;

/**
 * - "serial": handlers executam um após o outro, na ordem de registro. Padrão.
 * - "parallel": handlers executam em paralelo, sem garantia de ordem.
 */
export type DispatchMode = "serial" | "parallel";

export type DomainEventBusOptions = {
	dispatchMode?: DispatchMode;
};

export class DomainEventBus implements DomainEventPublisher {
	private readonly handlers = new Map<string, Set<DomainEventListener<any>>>();
	private readonly dispatchMode: DispatchMode;

	public constructor({ dispatchMode = "serial" }: DomainEventBusOptions = {}) {
		this.dispatchMode = dispatchMode;
	}

	private typeOf(eventClass: DomainEventClass<any>): string {
		const type = eventClass.type;

		if (typeof type !== "string" || type.length === 0) {
			throw new DDDError("DOMAIN_EVENT_TYPE_MISSING", {
				params: { event: eventClass.name },
				cause: eventClass,
			});
		}

		return type;
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
		return this.handlers.get(this.typeOf(eventClass))?.has(handler) ?? false;
	}

	public register<D extends DomainEvent>(
		eventClass: DomainEventClass<D>,
		handler: DomainEventListener<D>,
	) {
		const type = this.typeOf(eventClass);
		const handlers =
			this.handlers.get(type) ?? new Set<DomainEventListener<any>>();

		handlers.add(handler);
		this.handlers.set(type, handlers);

		return () => this.unregister(eventClass, handler);
	}

	public unregister<D extends DomainEvent>(
		eventClass: DomainEventClass<D>,
		handler: DomainEventListener<D>,
	) {
		const type = this.typeOf(eventClass);
		const handlers = this.handlers.get(type);

		if (!handlers) {
			return;
		}

		handlers.delete(handler);

		if (handlers.size === 0) {
			this.handlers.delete(type);
		}
	}

	public async dispatch(domainEvent: DomainEvent) {
		const handlers = Array.from(this.handlers.get(domainEvent.type) ?? []);

		if (handlers.length === 0) {
			return;
		}

		const errors = await this.run(handlers, domainEvent);

		if (errors.length > 0) {
			throw new DDDError("DOMAIN_EVENT_DISPATCH_FAILED", {
				params: {
					event: domainEvent.type,
					count: errors.length,
				},
				cause: new AggregateError(errors),
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
				cause: new AggregateError(failures),
			});
		}
	}
}
