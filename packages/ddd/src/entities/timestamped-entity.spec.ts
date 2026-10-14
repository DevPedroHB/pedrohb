import { faker } from "@faker-js/faker";
import { makeTestTimestampedEntity } from "#test/factories/make-test-timestamped-entity.js";
import { createTimestamps, TimestampedEntity } from "./timestamped-entity.js";

describe("TimestampedEntity", () => {
	it("should create an entity with id, props and timestamps", () => {
		const { id, props, entity } = makeTestTimestampedEntity();

		expect(entity).toBeInstanceOf(TimestampedEntity);
		expect(entity.id).toBe(id);
		expect(entity.name).toBe(props.name);
		expect(entity.age).toBe(props.age);
		expect(entity.createdAt).toBe(props.createdAt);
		expect(entity.updatedAt).toBe(props.updatedAt);
		expect(entity.toJSON()).toEqual({ ...id.toJSON(), ...props });
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
});

describe("createTimestamps", () => {
	it("should create timestamps with the current date", () => {
		const { createdAt, updatedAt } = createTimestamps();

		expect(createdAt).toBeInstanceOf(Date);
		expect(updatedAt).toBeInstanceOf(Date);
		expect(createdAt).toEqual(updatedAt);
	});

	it("should create timestamps with the given date", () => {
		const now = faker.date.recent();
		const { createdAt, updatedAt } = createTimestamps(now);

		expect(createdAt).toBe(now);
		expect(updatedAt).toBe(now);
	});
});
