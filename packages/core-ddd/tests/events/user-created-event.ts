import { DomainEvent } from "@/events/domain-event";
import type { UserAggregate } from "@tests/entities/user-aggregate";

export class UserCreatedEvent extends DomainEvent {
	public readonly user: UserAggregate;

	constructor(user: UserAggregate) {
		super();

		this.user = user;
	}

	public getAggregateId() {
		return this.user.id;
	}
}
