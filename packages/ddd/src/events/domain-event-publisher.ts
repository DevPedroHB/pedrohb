import type { DomainEvent } from "./domain-event.js";

export abstract class DomainEventPublisher {
	public abstract dispatch(domainEvent: DomainEvent): Promise<void>;
	public abstract dispatchAll(
		domainEvents: Iterable<DomainEvent>,
	): Promise<void>;
}
