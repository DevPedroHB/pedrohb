import { DDDError } from "#/errors/ddd-error.js";
import { UUID, UUID_MAX, UUID_NIL } from "./uuid.js";

describe("UUID", () => {
	it("should create a valid UUIDv7 by default", () => {
		const uuid = UUID.create();

		expect(UUID.validate(uuid.id)).toBe(true);
		expect(UUID.version(uuid.id)).toBe(7);
		expect(uuid.toJSON()).toEqual({ id: uuid.id });
	});

	it("should create a UUID from a given value", () => {
		const id = UUID.generate();

		expect(UUID.create(id).id).toBe(id);
	});

	it("should throw a DDDError when the value is invalid", () => {
		const create = () => UUID.create("invalid-uuid");

		expect(create).toThrow(DDDError);
		expect(create).toThrow(
			expect.objectContaining({ code: "INVALID_ENTITY_ID" }),
		);
	});

	it("should validate and invalidate values", () => {
		expect(UUID.validate(UUID.generate())).toBe(true);
		expect(UUID.validate(UUID_NIL)).toBe(true);
		expect(UUID.validate(UUID_MAX)).toBe(true);
		expect(UUID.validate("not-a-uuid")).toBe(false);
		expect(UUID.validate(undefined)).toBe(false);
	});

	it("should expose isValid on the instance", () => {
		const uuid = UUID.create();

		expect(uuid.isValid(uuid.id)).toBe(true);
		expect(uuid.isValid("not-a-uuid")).toBe(false);
	});

	it("should generate distinct v7 UUIDs", () => {
		const first = UUID.generate();
		const second = UUID.generate();

		expect(first).not.toBe(second);
		expect(UUID.version(first)).toBe(7);
		expect(UUID.version(second)).toBe(7);
	});

	it("should round-trip parse and stringify", () => {
		const id = UUID.generate();

		expect(UUID.stringify(UUID.parse(id))).toBe(id);
	});

	it("should return the version of known UUIDs", () => {
		expect(UUID.version(UUID_NIL)).toBe(0);
		expect(UUID.version(UUID.generate())).toBe(7);
	});
});
