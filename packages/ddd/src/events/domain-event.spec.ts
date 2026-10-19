import { UUID } from "#/entity-ids/uuid.js";
import { DomainEvent } from "#/index.js";
import { makeTestAggregate } from "#test/factories/make-test-aggregate.js";
import type { TestAggregate } from "#test/test-aggregate.js";
import { TestEntityId } from "#test/test-entity-id.js";

describe("DomainEvent", () => {
	class DefaultIdDomainEvent extends DomainEvent<TestAggregate> {
		public toJSON() {
			return {};
		}
	}

	it("should create a domain event with its data, a default id and occurredAt", () => {
		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();

		expect(domainEvent.data).toEqual(aggregate);
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

	it("should create a domain event with a default UUID id from the base class", () => {
		const { aggregate } = makeTestAggregate();
		const domainEvent = new DefaultIdDomainEvent({ data: aggregate });

		expect(domainEvent.id).toBeInstanceOf(UUID);
		expect(domainEvent.data).toEqual(aggregate);
	});
});
