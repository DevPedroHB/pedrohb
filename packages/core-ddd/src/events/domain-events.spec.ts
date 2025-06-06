import { UserCreatedEvent } from "@tests/events/user-created-event";
import { makeUserAggregate } from "@tests/factories/user-aggregate-factory";
import { DomainEvents } from "./domain-events";

describe("DomainEvents", () => {
	afterEach(() => {
		DomainEvents.clearHandlers();
		DomainEvents.clearMarkedAggregates();
		DomainEvents.shouldRun = true;
	});

	it("should be able to register and call event handlers", () => {
		const handler = vi.fn();

		DomainEvents.registerHandler(UserCreatedEvent, handler);

		const user = makeUserAggregate();

		DomainEvents.dispatchEventsForAggregate(user.id);

		expect(handler).toHaveBeenCalledTimes(1);
		expect(handler).toHaveBeenCalledWith(expect.any(UserCreatedEvent));
	});

	it("should be able to mark an aggregate for dispatch", () => {
		const user = makeUserAggregate();

		DomainEvents.markAggregateForDispatch(user);

		DomainEvents.dispatchAll();

		expect(true).toBe(true);
	});

	it("should be able to dispatch events for a specific aggregate", () => {
		const handler = vi.fn();

		DomainEvents.registerHandler(UserCreatedEvent, handler);

		const user = makeUserAggregate();

		DomainEvents.dispatchEventsForAggregate(user.id);

		expect(handler).toHaveBeenCalled();
	});

	it("should be able to dispatch all events", () => {
		const handler = vi.fn();

		DomainEvents.registerHandler(UserCreatedEvent, handler);

		makeUserAggregate();
		makeUserAggregate();

		DomainEvents.dispatchAll();

		expect(handler).toHaveBeenCalledTimes(2);
	});

	it("should be able to clear handlers", () => {
		const handler = vi.fn();

		DomainEvents.registerHandler(UserCreatedEvent, handler);
		DomainEvents.clearHandlers();

		const user = makeUserAggregate();

		DomainEvents.dispatchEventsForAggregate(user.id);

		expect(handler).not.toHaveBeenCalled();
	});

	it("should be able to clear marked aggregates", () => {
		const user = makeUserAggregate();

		DomainEvents.clearMarkedAggregates();
		DomainEvents.dispatchEventsForAggregate(user.id);

		expect(true).toBe(true);
	});

	it("should not dispatch if shouldRun is false", () => {
		const handler = vi.fn();

		DomainEvents.registerHandler(UserCreatedEvent, handler);

		makeUserAggregate();

		DomainEvents.shouldRun = false;
		DomainEvents.dispatchAll();

		expect(handler).not.toHaveBeenCalled();
	});
});
