import { DDDError } from "#/errors/ddd-error.js";
import {
	type MakeTestAggregate,
	makeTestAggregate,
} from "#test/factories/make-test-aggregate.js";

let testAggregate: MakeTestAggregate;

describe("Aggregate", () => {
	beforeEach(() => {
		testAggregate = makeTestAggregate();
	});

	it("should not have domain events when created with an existing id", () => {
		const { aggregate } = testAggregate;

		expect(aggregate.events.length).toBe(0);
		expect(aggregate.pullDomainEvents()).toEqual([]);
	});

	it("should collect added domain events", () => {
		const { aggregate } = testAggregate;
		const event1 = aggregate.addNewDomainEvent();
		const event2 = aggregate.addNewDomainEvent();

		expect(aggregate.events).toEqual([event1, event2]);
	});

	it("should return a frozen snapshot of the domain events", () => {
		const { aggregate } = testAggregate;

		aggregate.addNewDomainEvent();

		expect(Object.isFrozen(aggregate.events)).toBe(true);
		expect(aggregate.events.length).toBe(1);
	});

	it("should pull domain events and clear them", () => {
		const { aggregate } = testAggregate;
		const event1 = aggregate.addNewDomainEvent();
		const event2 = aggregate.addNewDomainEvent();
		const events = aggregate.pullDomainEvents();

		expect(events).toEqual([event1, event2]);
		expect(aggregate.events.length).toBe(0);
		expect(aggregate.pullDomainEvents()).toEqual([]);
	});

	it("should pull a single domain event and keep the others", () => {
		const { aggregate } = testAggregate;
		const event1 = aggregate.addNewDomainEvent();
		const event2 = aggregate.addNewDomainEvent();
		const pulledEvent = aggregate.pullDomainEvent(event1);

		expect(pulledEvent).toBe(event1);
		expect(aggregate.events).toEqual([event2]);
	});

	it("should clear all domain events", () => {
		const { aggregate } = testAggregate;

		aggregate.addNewDomainEvent();
		aggregate.addNewDomainEvent();

		aggregate.clearDomainEvents();

		expect(aggregate.events).toEqual([]);
	});

	it("should clear only the specified domain events", () => {
		const { aggregate } = testAggregate;
		const event1 = aggregate.addNewDomainEvent();
		const event2 = aggregate.addNewDomainEvent();

		aggregate.clearDomainEvents([event1]);

		expect(aggregate.events).toEqual([event2]);
	});

	it("should throw a DDDError when pulling a domain event that was not added", () => {
		const { aggregate } = testAggregate;
		const event = makeTestAggregate().aggregate.addNewDomainEvent();
		const pull = () => aggregate.pullDomainEvent(event);

		expect(pull).toThrow(DDDError);
		expect(pull).toThrow(
			expect.objectContaining({ code: "DOMAIN_EVENT_NOT_FOUND" }),
		);
	});
});
