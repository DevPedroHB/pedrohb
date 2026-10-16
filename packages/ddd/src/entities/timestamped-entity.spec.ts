import { faker } from "@faker-js/faker";
import { makeTestTimestampedEntity } from "#test/factories/make-test-timestamped-entity.js";
import { TimestampedEntity } from "./timestamped-entity.js";

describe("TimestampedEntity", () => {
	it("should create an entity with id, props and timestamps", () => {
		const { id, props, entity } = makeTestTimestampedEntity();

		expect(entity).toBeInstanceOf(TimestampedEntity);
		expect(entity.id).toBe(id);
		expect(entity.name).toBe(props.name);
		expect(entity.age).toBe(props.age);
		expect(entity.createdAt).toBe(props.createdAt);
		expect(entity.updatedAt).toBe(props.updatedAt);
	});

	it("should update updatedAt when the entity is touched", () => {
		const createdAt = faker.date.past();
		const { entity } = makeTestTimestampedEntity({
			createdAt,
			updatedAt: createdAt,
		});

		entity.name = faker.person.fullName();

		expect(entity.createdAt).toBe(createdAt);
		expect(entity.updatedAt.getTime()).toBeGreaterThan(createdAt.getTime());
	});

	it("should serialize the id, props and timestamps to JSON", () => {
		const { id, props, entity } = makeTestTimestampedEntity();

		expect(entity.toJSON()).toEqual({
			id: id.id,
			name: props.name,
			age: props.age,
			createdAt: props.createdAt.toISOString(),
			updatedAt: props.updatedAt.toISOString(),
		});
	});
});
