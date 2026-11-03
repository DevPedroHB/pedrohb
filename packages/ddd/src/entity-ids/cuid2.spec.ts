import { DDDError } from "#/errors/ddd-error.js";
import { CUID2, CUID2_DEFAULT_LENGTH } from "./cuid2.js";

describe("CUID2", () => {
	it("should creates a valid CUID2 by default and serializes it", () => {
		const cuid2 = CUID2.create();

		expect(cuid2.id).toHaveLength(CUID2_DEFAULT_LENGTH);
		expect(CUID2.isCuid(cuid2.id)).toBe(true);
		expect(cuid2.toJSON()).toEqual({ id: cuid2.id });
	});

	it("should creates an instance from a given valid CUID2", () => {
		const id = CUID2.generate();

		expect(CUID2.create(id).id).toBe(id);
	});

	it("should validates CUID2s on the class and instance", () => {
		const cuid2 = CUID2.create();

		expect(CUID2.isCuid(cuid2.id)).toBe(true);
		expect(CUID2.isCuid("invalid-id")).toBe(false);
		expect(cuid2.isValid(cuid2.id)).toBe(true);
		expect(cuid2.isValid("invalid-id")).toBe(false);
	});

	it("should throws a DDDError for an invalid CUID2", () => {
		expect(() => CUID2.create("invalid-id")).toThrow(DDDError);
	});
});
