import type { EntityId } from "#/entity-ids/entity-id.js";
import { DDDError } from "#/errors/ddd-error.js";
import type { DomainEvent } from "#/events/domain-event.js";
import { Entity } from "./entity.js";

export abstract class Aggregate<
	Id extends EntityId = EntityId,
	Props extends object = object,
> extends Entity<Id, Props> {
	private readonly domainEvents = new Set<DomainEvent<Aggregate<Id, Props>>>();

	public get events() {
		return Object.freeze([...this.domainEvents]);
	}

	protected addDomainEvent(domainEvent: DomainEvent<Aggregate<Id, Props>>) {
		this.domainEvents.add(domainEvent);
	}

	public pullDomainEvent(domainEvent: DomainEvent<Aggregate<Id, Props>>) {
		if (!this.domainEvents.has(domainEvent)) {
			throw new DDDError("DOMAIN_EVENT_NOT_FOUND", {
				params: {
					event: domainEvent.constructor.name,
				},
			});
		}

		this.domainEvents.delete(domainEvent);

		return domainEvent;
	}

	public pullDomainEvents() {
		const events = [...this.domainEvents];

		this.domainEvents.clear();

		return events;
	}
}
