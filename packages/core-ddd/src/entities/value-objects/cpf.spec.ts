import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { CPF } from "./cpf";

describe("CPF", () => {
	it("should be able to strip non-numeric characters from CPF", () => {
		const stripped = CPF.strip("123.456.789-09");

		expect(stripped).toBe("12345678909");
	});

	it("should be able to format a numeric CPF correctly", () => {
		const formatted = CPF.format("12345678909");

		expect(formatted).toBe("123.456.789-09");
	});

	it("should be able to validate a known valid CPF", () => {
		expect(CPF.isValid("52998224725")).toBe(true);
	});

	it("should not be able to validate a CPF with incorrect check digits", () => {
		expect(CPF.isValid("12345678900")).toBe(false);
	});

	it("should not be able to validate a CPF with all repeated digits", () => {
		expect(CPF.isValid("11111111111")).toBe(false);
	});

	it("should not be able to validate a CPF with non-numeric characters", () => {
		expect(CPF.isValid("abc.def.ghi-jk")).toBe(false);
	});

	it("should be able to generate a valid CPF (unformatted)", () => {
		const generated = CPF.generate();

		expect(generated).toMatch(/^\d{11}$/);
		expect(CPF.isValid(generated)).toBe(true);
	});

	it("should be able to generate a valid CPF (formatted)", () => {
		const generated = CPF.generate(true);

		expect(generated).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
		expect(CPF.isValid(CPF.strip(generated))).toBe(true);
	});

	it("should be able to create a CPF instance from valid input", () => {
		const cpf = CPF.create("529.982.247-25");

		expect(cpf).toBeInstanceOf(CPF);
		expect(cpf.toValue()).toBe("529.982.247-25");
	});

	it("should not be able to create a CPF instance from invalid input", () => {
		expect(() => CPF.create("123.456.789-00")).toThrow(InvalidCredentialsError);
	});

	it("should be able to create a CPF instance from generated value", () => {
		const cpf = CPF.create();

		expect(cpf).toBeInstanceOf(CPF);
		expect(cpf.toValue()).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
	});
});
