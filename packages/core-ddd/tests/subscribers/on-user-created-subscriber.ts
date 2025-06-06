import { EventSubscriber } from "@/events/event-subscriber";
import { UserCreatedEvent } from "@tests/events/user-created-event";

export class OnUserCreatedSubscriber extends EventSubscriber<UserCreatedEvent> {
	constructor() {
		super(UserCreatedEvent);
	}

	protected async handleEvent(_event: UserCreatedEvent) {}
}
