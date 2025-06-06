import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { CNPJ } from "./cnpj";

describe("CNPJ", () => {
	it("should be able to strip non-numeric characters from CNPJ", () => {
		const stripped = CNPJ.strip("12.345.678/0001-95");

		expect(stripped).toBe("12345678000195");
	});

	it("should be able to format a numeric CNPJ correctly", () => {
		const formatted = CNPJ.format("12345678000195");

		expect(formatted).toBe("12.345.678/0001-95");
	});

	it("should be able to validate a known valid CNPJ", () => {
		expect(CNPJ.isValid("11222333000181")).toBe(true);
	});

	it("should not be able to validate a CNPJ with incorrect check digits", () => {
		expect(CNPJ.isValid("11222333000100")).toBe(false);
	});

	it("should not be able to validate a CNPJ with all repeated digits", () => {
		expect(CNPJ.isValid("11111111111111")).toBe(false);
	});

	it("should not be able to validate a malformed CNPJ", () => {
		expect(CNPJ.isValid("abc.def/ghij-kl")).toBe(false);
		expect(CNPJ.isValid("1234567890")).toBe(false);
	});

	it("should be able to generate a valid CNPJ (unformatted)", () => {
		const generated = CNPJ.generate();

		expect(generated).toMatch(/^\d{14}$/);
		expect(CNPJ.isValid(generated)).toBe(true);
	});

	it("should be able to generate a valid CNPJ (formatted)", () => {
		const generated = CNPJ.generate(true);

		expect(generated).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
		expect(CNPJ.isValid(CNPJ.strip(generated))).toBe(true);
	});

	it("should be able to create a CNPJ instance from valid input", () => {
		const cnpj = CNPJ.create("11.222.333/0001-81");

		expect(cnpj).toBeInstanceOf(CNPJ);
		expect(cnpj.toValue()).toBe("11.222.333/0001-81");
	});

	it("should not be able to create a CNPJ instance from invalid input", () => {
		expect(() => CNPJ.create("11.222.333/0001-00")).toThrow(
			InvalidCredentialsError,
		);
	});

	it("should be able to create a CNPJ instance from generated value", () => {
		const cnpj = CNPJ.create();

		expect(cnpj).toBeInstanceOf(CNPJ);
		expect(cnpj.toValue()).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
	});
});
