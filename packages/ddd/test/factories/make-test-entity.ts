import { faker } from "@faker-js/faker";
import { Timestamps } from "#/index.js";
import { TestEntity, type TestEntityProps } from "#test/test-entity.js";
import type { TestEntityId } from "#test/test-entity-id.js";

export function makeTestEntity(
	overrides: Partial<TestEntityProps> = {},
	id?: TestEntityId,
) {
	const props: TestEntityProps = {
		name: faker.person.fullName(),
		age: faker.number.int({ min: 1, max: 100 }),
		timestamps: Timestamps.create(faker.date.past()),
		...overrides,
	};
	const entity = TestEntity.create(props, id);

	return {
		id: entity.id,
		props,
		entity,
	};
}

export type MakeTestEntity = ReturnType<typeof makeTestEntity>;
