import { DDDError } from "#/errors/ddd-error.js";
import { NanoID } from "./nanoid.js";

describe("NanoID", () => {
	it("should create a NanoID by default", () => {
		const nanoid = NanoID.create();

		expect(nanoid.id).toHaveLength(21);
		expect(nanoid.toJSON()).toEqual({ id: nanoid.id });
	});

	it("should validate non-empty IDs containing only URL alphabet characters", () => {
		const nanoid = NanoID.create();

		expect(nanoid.isValid("abc_123-XYZ")).toBe(true);
		expect(nanoid.isValid("")).toBe(false);
		expect(nanoid.isValid("invalid+id")).toBe(false);
	});

	it("should throw a DDDError when created with an invalid ID", () => {
		expect(() => NanoID.create("invalid+id")).toThrow(DDDError);
	});
});
