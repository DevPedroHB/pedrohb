import { TestAggregate } from "#test/test-aggregate.js";
import type { TestEntityProps } from "#test/test-entity.js";
import { TestEntityId } from "#test/test-entity-id.js";
import { makeTestEntity } from "./make-test-entity.js";

export function makeTestAggregate(
	overrides: Partial<TestEntityProps> = {},
	id: TestEntityId = TestEntityId.create(),
) {
	const { props } = makeTestEntity(overrides, id);

	return {
		id,
		props,
		aggregate: TestAggregate.create(props, id),
	};
}
