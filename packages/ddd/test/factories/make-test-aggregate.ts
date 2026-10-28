import { TestAggregate } from "#test/test-aggregate.js";
import type { TestEntityProps } from "#test/test-entity.js";
import type { TestEntityId } from "#test/test-entity-id.js";
import { makeTestEntity } from "./make-test-entity.js";

export function makeTestAggregate(
	overrides: Partial<TestEntityProps> = {},
	id?: TestEntityId,
) {
	const { props } = makeTestEntity(overrides, id);
	const aggregate = TestAggregate.create(props, id);

	return {
		id: aggregate.id,
		props,
		aggregate,
	};
}

export type MakeTestAggregate = ReturnType<typeof makeTestAggregate>;
