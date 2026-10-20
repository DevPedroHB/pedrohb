import { UUID } from "#/entity-ids/uuid.js";
import { DomainEvent } from "#/index.js";
import {
	type MakeTestAggregate,
	makeTestAggregate,
} from "#test/factories/make-test-aggregate.js";
import type { TestAggregate } from "#test/test-aggregate.js";
import { TestEntityId } from "#test/test-entity-id.js";

let testAggregate: MakeTestAggregate;

describe("DomainEvent", () => {
	class DefaultIdDomainEvent extends DomainEvent<TestAggregate> {
		public toJSON() {
			return {};
		}
	}

	beforeEach(() => {
		testAggregate = makeTestAggregate();
	});

	it("should create a domain event with its data, a default id and occurredAt", () => {
		const { aggregate } = testAggregate;
		const domainEvent = aggregate.addNewDomainEvent();

		expect(domainEvent.data).toEqual(aggregate);
		expect(domainEvent.id).toBeInstanceOf(TestEntityId);
		expect(domainEvent.occurredAt.getTime()).toBeLessThanOrEqual(Date.now());
	});

	it("should create a domain event with a custom occurredAt and id", () => {
		const { aggregate } = testAggregate;
		const occurredAt = new Date("2026-01-01T00:00:00.000Z");
		const id = TestEntityId.create();
		const domainEvent = aggregate.addNewDomainEvent(occurredAt, id);

		expect(domainEvent.occurredAt).toBe(occurredAt);
		expect(domainEvent.id).toBe(id);
	});

	it("should create a domain event with a default UUID id from the base class", () => {
		const { aggregate } = testAggregate;
		const domainEvent = new DefaultIdDomainEvent({ data: aggregate });

		expect(domainEvent.id).toBeInstanceOf(UUID);
		expect(domainEvent.data).toEqual(aggregate);
	});
});
