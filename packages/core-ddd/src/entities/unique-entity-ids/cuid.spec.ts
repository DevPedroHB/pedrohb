import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { CUID } from "./cuid";

describe("CUID", () => {
	it("should be able to generate a valid CUID", () => {
		const generated = CUID.generate();

		expect(CUID.isValid(generated)).toBe(true);
	});

	it("should be able to validate a correct CUID", () => {
		const validCuid = CUID.generate();

		expect(CUID.isValid(validCuid)).toBe(true);
	});

	it("should not be able to validate an invalid CUID", () => {
		const invalidCuid = "123-invalid";

		expect(CUID.isValid(invalidCuid)).toBe(false);
	});

	it("should be able to create a CUID instance with a valid CUID", () => {
		const validCuid = CUID.generate();
		const instance = CUID.create(validCuid);

		expect(instance).toBeInstanceOf(CUID);
		expect(instance.toValue()).toBe(validCuid);
	});

	it("should be able to create a CUID instance without providing a CUID", () => {
		const instance = CUID.create();

		expect(instance).toBeInstanceOf(CUID);
		expect(CUID.isValid(instance.toValue())).toBe(true);
	});

	it("should not be able to create a CUID instance with an invalid CUID", () => {
		const invalidCuid = "not-a-cuid";

		expect(() => CUID.create(invalidCuid)).toThrow(InvalidCredentialsError);
	});
});
