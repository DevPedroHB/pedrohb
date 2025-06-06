import { MethodNotImplementedError } from "@/errors/method-not-implemented-error";
import { makeUserEntity } from "@tests/factories/user-entity-factory";
import { makeUserWithAccessorsDefineProperty } from "@tests/factories/user-with-accessors-define-property-factory";
import { makeUserWithAccessorsProxy } from "@tests/factories/user-with-accessors-proxy-factory";
import { Entity } from "./entity";
import { UUID } from "./unique-entity-ids/uuid";

describe("Entity", () => {
	it("should be able to use withManualAccessors to access props as properties", () => {
		const entity = makeUserEntity({
			name: "John Doe",
			age: 23,
		});

		expect(entity.name).toBe("John Doe");
		expect(entity.age).toBe(23);

		entity.name = "Jane Doe";
		entity.age = 24;

		expect(entity.name).toBe("Jane Doe");
		expect(entity.age).toBe(24);
	});

	it("should be able to use withAccessorsDefineProperty to access props as properties", () => {
		const entity = makeUserWithAccessorsDefineProperty({
			name: "John Doe",
			age: 23,
		});

		expect(entity.name).toBe("John Doe");
		expect(entity.age).toBe(23);

		entity.name = "Jane Doe";
		entity.age = 24;

		expect(entity.name).toBe("Jane Doe");
		expect(entity.age).toBe(24);
	});

	it("should be able to use withAccessorsProxy to access props as properties", () => {
		const entity = makeUserWithAccessorsProxy({
			name: "John Doe",
			age: 23,
		});

		expect(entity.name).toBe("John Doe");
		expect(entity.age).toBe(23);

		entity.name = "Jane Doe";
		entity.age = 24;

		expect(entity.name).toBe("Jane Doe");
		expect(entity.age).toBe(24);
	});

	it("should be able to compare equality with same id", () => {
		const id = UUID.create();
		const entityA = makeUserEntity({}, id);
		const entityB = makeUserEntity({}, id);

		expect(entityA.equals(entityB)).toBeTruthy();
	});

	it("should not be able to compare equality with different ids", () => {
		const entityA = makeUserEntity();
		const entityB = makeUserEntity();

		expect(entityA.equals(entityB)).toBe(false);
	});

	it("should be able to generate a hash from the entity", () => {
		const entity = makeUserEntity();
		const hash = entity.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});

	it("should not be able to call static create method on base class", () => {
		expect(() => Entity.create({})).toThrow(MethodNotImplementedError);
	});
});
