import { DomainEvent, type EntityId } from "#/index.js";
import type { TestAggregate } from "./test-aggregate.js";
import { TestEntityId } from "./test-entity-id.js";

export class TestDomainEvent extends DomainEvent<TestAggregate> {
	public static create(
		aggregate: TestAggregate,
		occurredAt = new Date(),
		id: EntityId = TestEntityId.create(),
	) {
		return new TestDomainEvent(aggregate, occurredAt, id);
	}
}
