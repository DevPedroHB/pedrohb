import { DomainEvents } from "@/events/domain-events";
import { UserCreatedEvent } from "@tests/events/user-created-event";
import { makeUserAggregate } from "@tests/factories/user-aggregate-factory";

describe("Aggregate", () => {
	it("should be able to add domain events to the aggregate", () => {
		const aggregate = makeUserAggregate();

		expect(aggregate.domainEvents.values().next().value).toBeInstanceOf(
			UserCreatedEvent,
		);
	});

	it("should be able to clear domain events", () => {
		const aggregate = makeUserAggregate();

		aggregate.clearEvents();

		expect(aggregate.domainEvents.size).toBe(0);
	});

	it("should be able to return a custom hash", () => {
		const aggregate = makeUserAggregate();
		const hash = aggregate.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});

	it("should call DomainEvents.markAggregateForDispatch when adding event", () => {
		const spy = vi.spyOn(DomainEvents, "markAggregateForDispatch");
		const aggregate = makeUserAggregate();

		expect(spy).toHaveBeenCalledWith(aggregate);
	});
});
