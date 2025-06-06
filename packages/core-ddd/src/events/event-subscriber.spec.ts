import { UserAggregate } from "@tests/entities/user-aggregate";
import { UserCreatedEvent } from "@tests/events/user-created-event";
import { makeUserAggregate } from "@tests/factories/user-aggregate-factory";
import { OnUserCreatedSubscriber } from "@tests/subscribers/on-user-created-subscriber";
import { DomainEvents } from "./domain-events";
import { EventSubscriber } from "./event-subscriber";

describe("EventSubscriber", () => {
	it("should be able to register an event handler when instantiated", async () => {
		const spy = vi.spyOn(DomainEvents, "registerHandler");

		const user = makeUserAggregate();

		DomainEvents.dispatchEventsForAggregate(user.id);

		new OnUserCreatedSubscriber();

		expect(spy).toHaveBeenCalledWith(UserCreatedEvent, expect.any(Function));

		spy.mockRestore();
	});

	it("should be able to handle a dispatched event", async () => {
		class TestSubscriber extends EventSubscriber<UserCreatedEvent> {
			public receivedEvent: UserCreatedEvent | null = null;

			constructor() {
				super(UserCreatedEvent);
			}

			protected async handleEvent(event: UserCreatedEvent): Promise<void> {
				this.receivedEvent = event;
			}
		}

		const subscriber = new TestSubscriber();

		const user = UserAggregate.create({
			name: "Alice",
			age: 30,
		});

		await DomainEvents.dispatchEventsForAggregate(user.id);

		await new Promise(process.nextTick);

		expect(subscriber.receivedEvent).toBeInstanceOf(UserCreatedEvent);
		expect(subscriber.receivedEvent?.user.name).toBe("Alice");
	});
});
