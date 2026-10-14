import { makeTestEntity } from "#test/factories/make-test-entity.js";
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
		const { id, props, entity } = makeTestEntity();

		expect(entity).toBeInstanceOf(Entity);
		expect(entity.id).toBe(id);
		expect(entity.name).toBe(props.name);
		expect(entity.age).toBe(props.age);
		expect(entity.toJSON()).toEqual({ ...id.toJSON(), ...props });
	});

	it("should be equal to itself", () => {
		const { entity } = makeTestEntity();

		expect(entity.equals(entity)).toBe(true);
	});

	it("should be equal to another entity with the same id", () => {
		const { id, entity: first } = makeTestEntity();
		const { entity: second } = makeTestEntity({}, id);

		expect(first.equals(second)).toBe(true);
	});

	it("should not be equal to an entity with a different id", () => {
		const { props, entity: first } = makeTestEntity();
		const { entity: second } = makeTestEntity(props);

		expect(first.equals(second)).toBe(false);
	});

	it("should not be equal to an entity of a different class", () => {
		const { id, props, entity: first } = makeTestEntity();
		const second = OtherEntity.create(props, id);

		expect(first.equals(second)).toBe(false);
	});
});
