import { TestEntity, type TestEntityProps } from "#test/test-entity.js";
import { TestEntityId } from "#test/test-entity-id.js";
import { Entity } from "./entity.js";

describe("Entity", () => {
	class OtherEntity extends TestEntity {
		public static override create(
			props: TestEntityProps,
			id = TestEntityId.create(),
		) {
			return new OtherEntity(id, props);
		}
	}

	it("should create an entity with id and props", () => {
		const id = TestEntityId.create();
		const entity = TestEntity.create({ name: "Pedro", age: 26 }, id);

		expect(entity).toBeInstanceOf(Entity);
		expect(entity.id).toBe(id);
		expect(entity.name).toBe("Pedro");
		expect(entity.age).toBe(26);
		expect(entity.toJSON()).toEqual({ ...id.toJSON(), name: "Pedro", age: 26 });
	});

	it("should be equal to itself", () => {
		const entity = TestEntity.create({ name: "Pedro", age: 26 });

		expect(entity.equals(entity)).toBe(true);
	});

	it("should be equal to another entity with the same id", () => {
		const id = TestEntityId.create();
		const first = TestEntity.create({ name: "Pedro", age: 26 }, id);
		const second = TestEntity.create({ name: "Outro", age: 27 }, id);

		expect(first.equals(second)).toBe(true);
	});

	it("should not be equal to an entity with a different id", () => {
		const first = TestEntity.create({ name: "Pedro", age: 26 });
		const second = TestEntity.create({ name: "Pedro", age: 26 });

		expect(first.equals(second)).toBe(false);
	});

	it("should not be equal to an entity of a different class", () => {
		const id = TestEntityId.create();
		const first = TestEntity.create({ name: "Pedro", age: 26 }, id);
		const second = OtherEntity.create({ name: "Pedro", age: 26 }, id);

		expect(first.equals(second)).toBe(false);
	});
});
