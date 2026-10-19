import { DDDError } from "#/errors/ddd-error.js";
import type { DomainEvent } from "./domain-event.js";
import type { DomainEventBus, DomainEventClass } from "./domain-event-bus.js";

export abstract class DomainEventHandler<D extends DomainEvent = DomainEvent> {
	private readonly listener = async (domainEvent: D) =>
		await this.handle(domainEvent);
	private disposed = false;
	protected abstract readonly domainEvent: DomainEventClass<D>;

	public constructor(private readonly domainEventBus: DomainEventBus) {}

	public get isSubscribed() {
		return this.domainEventBus.isHandlerSubscribed(
			this.domainEvent,
			this.listener,
		);
	}

	public get isDisposed() {
		return this.disposed;
	}

	public subscribe() {
		if (this.disposed) {
			throw new DDDError("HANDLER_DISPOSED", {
				params: {
					handler: this.constructor.name,
				},
			});
		}

		if (!this.isSubscribed) {
			this.domainEventBus.register(this.domainEvent, this.listener);
		}

		return () => this.unsubscribe();
	}

	public unsubscribe() {
		if (!this.isSubscribed) {
			return;
		}

		this.domainEventBus.unregister(this.domainEvent, this.listener);
	}

	public dispose() {
		this.unsubscribe();

		this.disposed = true;
	}

	public abstract handle(domainEvent: D): Promise<void>;
}
