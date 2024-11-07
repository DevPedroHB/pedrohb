import { DomainEvent } from "@/core/events/domain-event";
import { User } from "../entities/user";

export class UserCreatedEvent implements DomainEvent {
	public ocurredAt: Date;
	public user: User;

	constructor(user: User) {
		this.ocurredAt = new Date();
		this.user = user;
	}

	getAggregateId() {
		return this.user.id;
	}
}
