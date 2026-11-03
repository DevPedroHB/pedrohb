import { DDDError } from "#/errors/ddd-error.js";
import { ULID } from "./ulid.js";

describe("ULID", () => {
	it("should creates a valid ULID by default and serializes it", () => {
		const ulid = ULID.create();

		expect(ULID.isValid(ulid.id)).toBe(true);
		expect(ulid.toJSON()).toEqual({ id: ulid.id });
	});

	it("should creates an instance from a given valid ULID", () => {
		const id = ULID.generate(1_700_000_000_000);

		expect(ULID.create(id).id).toBe(id);
	});

	it("should throws a DDDError for an invalid ULID", () => {
		expect(() => ULID.create("invalid-ulid")).toThrow(DDDError);
		expect(() => ULID.create("invalid-ulid")).toThrow(
			expect.objectContaining({ code: "INVALID_ENTITY_ID" }),
		);
	});

	it("should validates ULIDs on the class and instance", () => {
		const ulid = ULID.create();

		expect(ULID.isValid(ulid.id)).toBe(true);
		expect(ULID.isValid("invalid-ulid")).toBe(false);
		expect(ulid.isValid(ulid.id)).toBe(true);
		expect(ulid.isValid("invalid-ulid")).toBe(false);
	});

	it("should generates a ULID for the provided timestamp", () => {
		const timestamp = 1_700_000_000_000;
		const id = ULID.generate(timestamp);

		expect(ULID.isValid(id)).toBe(true);
		expect(ULID.decodeTime(id)).toBe(timestamp);
		expect(ULID.encodeTime(timestamp)).toBe(id.slice(0, 10));
	});

	it("should converts between ULID and UUID", () => {
		const id = ULID.generate(1_700_000_000_000);

		expect(ULID.uuidToULID(ULID.ulidToUUID(id))).toBe(id);
	});
});
