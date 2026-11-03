import { DomainEvent } from "#/index.js";
import type { TestAggregate } from "./test-aggregate.js";
import { TestEntityId } from "./test-entity-id.js";

export class TestDomainEvent extends DomainEvent<TestAggregate, TestEntityId> {
	public static readonly type = "test.domain-event";

	public constructor(
		data: TestAggregate,
		occurredAt = new Date(),
		id = TestEntityId.create(),
	) {
		super({ data, occurredAt, id });
	}

	public toJSON() {
		return {
			...this.id.toJSON(),
			data: this.data.toJSON(),
			occurredAt: this.occurredAt.toISOString(),
		};
	}
}
