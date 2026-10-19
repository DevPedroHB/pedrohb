import { DomainEvent } from "#/index.js";
import type { TestAggregate } from "./test-aggregate.js";
import { TestEntityId } from "./test-entity-id.js";

export class TestDomainEvent extends DomainEvent<TestAggregate, TestEntityId> {
	public constructor(
		data: TestAggregate,
		occurredAt = new Date(),
		id = TestEntityId.create(),
	) {
		super({ data, occurredAt, id });
	}

	public toJSON() {
		return {
			id: this.id.toJSON().id,
			data: this.data.toJSON(),
			occurredAt: this.occurredAt.toISOString(),
		};
	}
}
