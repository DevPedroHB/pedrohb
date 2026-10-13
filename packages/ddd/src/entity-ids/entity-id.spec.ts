import { DDDError } from "#/errors/ddd-error.js";
import { TestEntityId } from "#test/test-entity-id.js";
import { EntityId } from "./entity-id.js";

describe("EntityId", () => {
	class OtherEntityId extends TestEntityId {
		public static override create(id = OtherEntityId.generate()) {
			return new OtherEntityId(id);
		}
	}

	it("should create an entity id with a valid value", () => {
		const id = TestEntityId.generate();

		const entityId = TestEntityId.create(id);

		expect(entityId).toBeInstanceOf(EntityId);
		expect(entityId.id).toBe(id);
		expect(entityId.toJSON()).toEqual({ id });
	});

	it("should throw a DDDError when the id is invalid", () => {
		const create = () => TestEntityId.create(123 as unknown as string);

		expect(create).toThrow(DDDError);
		expect(create).toThrow(
			expect.objectContaining({ code: "INVALID_ENTITY_ID" }),
		);
	});

	it("should be equal to itself", () => {
		const entityId = TestEntityId.create();

		expect(entityId.equals(entityId)).toBe(true);
	});

	it("should be equal to another entity id with the same value", () => {
		const id = TestEntityId.generate();

		expect(TestEntityId.create(id).equals(TestEntityId.create(id))).toBe(true);
	});

	it("should not be equal to an entity id with a different value", () => {
		expect(TestEntityId.create().equals(TestEntityId.create())).toBe(false);
	});

	it("should not be equal to an entity id of a different class", () => {
		const id = TestEntityId.generate();

		expect(TestEntityId.create(id).equals(OtherEntityId.create(id))).toBe(
			false,
		);
	});
});
