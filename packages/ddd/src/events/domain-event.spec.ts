import { makeTestAggregate } from "#test/factories/make-test-aggregate.js";
import { TestEntityId } from "#test/test-entity-id.js";

describe("DomainEvent", () => {
	it("should create a domain event with the aggregate, a default id and occurredAt", () => {
		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();

		expect(domainEvent.aggregate).toBe(aggregate);
		expect(domainEvent.id).toBeInstanceOf(TestEntityId);
		expect(domainEvent.occurredAt.getTime()).toBeLessThanOrEqual(Date.now());
	});

	it("should create a domain event with a custom occurredAt and id", () => {
		const { aggregate } = makeTestAggregate();
		const occurredAt = new Date("2026-01-01T00:00:00.000Z");
		const id = TestEntityId.create();
		const domainEvent = aggregate.addNewDomainEvent(occurredAt, id);

		expect(domainEvent.occurredAt).toBe(occurredAt);
		expect(domainEvent.id).toBe(id);
	});
});
