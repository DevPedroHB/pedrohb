import type { DomainEvent } from "./domain-event.js";
import type { DomainEventBus, DomainEventClass } from "./domain-event-bus.js";
import { domainEventBus as bus } from "./domain-events.js";

export abstract class DomainEventHandler<D extends DomainEvent = DomainEvent> {
	private readonly listener = async (domainEvent: D) =>
		await this.handle(domainEvent);
	protected abstract readonly domainEvent: DomainEventClass<D>;

	public constructor(private readonly domainEventBus: DomainEventBus = bus) {}

	public get isSubscribed() {
		return this.domainEventBus.isHandlerSubscribed(
			this.domainEvent,
			this.listener,
		);
	}

	public subscribe() {
		return this.domainEventBus.register(this.domainEvent, this.listener);
	}

	public unsubscribe() {
		this.domainEventBus.unregister(this.domainEvent, this.listener);
	}

	public abstract handle(domainEvent: D): Promise<void>;
}
