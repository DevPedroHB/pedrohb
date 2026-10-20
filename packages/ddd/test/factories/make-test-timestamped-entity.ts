import { faker } from "@faker-js/faker";
import { TestEntityId } from "#test/test-entity-id.js";
import {
	TestTimestampedEntity,
	type TestTimestampedEntityProps,
} from "#test/test-timestamped-entity.js";
import { makeTestEntity } from "./make-test-entity.js";

export function makeTestTimestampedEntity(
	overrides: Partial<TestTimestampedEntityProps> = {},
	id: TestEntityId = TestEntityId.create(),
) {
	const createdAt = overrides.createdAt ?? faker.date.past();
	const updatedAt =
		overrides.updatedAt ??
		faker.date.between({ from: createdAt, to: new Date() });

	const props: TestTimestampedEntityProps = {
		...makeTestEntity(overrides, id).props,
		createdAt,
		updatedAt,
	};

	return {
		id,
		props,
		entity: TestTimestampedEntity.create(props, id),
	};
}

export type MakeTestTimestampedEntity = ReturnType<
	typeof makeTestTimestampedEntity
>;
