import { DDDError } from "#/errors/ddd-error.js";
import {
	type MakeTestAggregate,
	makeTestAggregate,
} from "#test/factories/make-test-aggregate.js";
import { TestEntityId } from "#test/test-entity-id.js";

let testAggregate: MakeTestAggregate;

describe("Aggregate", () => {
	beforeEach(() => {
		testAggregate = makeTestAggregate();
	});

	it("should not have domain events when created with an existing id", () => {
		const { aggregate } = makeTestAggregate({}, TestEntityId.create());

		expect(aggregate.events.length).toBe(0);
		expect(aggregate.pullDomainEvents()).toEqual([]);
	});

	it("should collect added domain events", () => {
		const { aggregate } = testAggregate;

		aggregate.addNewDomainEvent();
		aggregate.addNewDomainEvent();

		expect(aggregate.events).toHaveLength(3);
	});

	it("should return a frozen snapshot of the domain events", () => {
		const { aggregate } = testAggregate;

		expect(Object.isFrozen(aggregate.events)).toBe(true);
		expect(aggregate.events.length).toBe(1);
	});

	it("should pull domain events and clear them", () => {
		const { aggregate } = testAggregate;

		aggregate.addNewDomainEvent();
		aggregate.addNewDomainEvent();

		const events = aggregate.pullDomainEvents();

		expect(events).toHaveLength(3);
		expect(aggregate.events.length).toBe(0);
		expect(aggregate.pullDomainEvents()).toEqual([]);
	});

	it("should pull a single domain event and keep the others", () => {
		const { aggregate } = testAggregate;
		const event = aggregate.addNewDomainEvent();

		const pulledEvent = aggregate.pullDomainEvent(event);

		expect(pulledEvent).toBe(event);
		expect(aggregate.events).toHaveLength(1);
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

		const event = aggregate.addNewDomainEvent();

		aggregate.clearDomainEvents([event]);

		expect(aggregate.events).toHaveLength(1);
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
