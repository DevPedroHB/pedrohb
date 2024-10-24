import { DomainEvent } from "../events/domain-event";
import { DomainEvents } from "../events/domain-events";
import { Entity } from "./entity";

export abstract class AggregateRoot<T> extends Entity<T> {
	private _domainEvents: Set<DomainEvent> = new Set();

	get domainEvents(): DomainEvent[] {
		return Array.from(this._domainEvents);
	}

	protected addDomainEvent(domainEvent: DomainEvent): void {
		this._domainEvents.add(domainEvent);

		DomainEvents.markAggregateForDispatch(this);
	}

	public clearEvents() {
		this._domainEvents.clear();
	}
}
