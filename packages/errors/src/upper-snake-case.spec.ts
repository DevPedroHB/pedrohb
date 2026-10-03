import { invalidCodeMessage, isUpperSnakeCase } from "./upper-snake-case.js";

describe("isUpperSnakeCase", () => {
	it("should accept single words", () => {
		expect(isUpperSnakeCase("A")).toBe(true);
		expect(isUpperSnakeCase("ERROR")).toBe(true);
		expect(isUpperSnakeCase("A1")).toBe(true);
	});

	it("should accept words separated by a single underscore", () => {
		expect(isUpperSnakeCase("INTERNAL_SERVER_ERROR")).toBe(true);
		expect(isUpperSnakeCase("ERROR_404")).toBe(true);
		expect(isUpperSnakeCase("A_B_C")).toBe(true);
	});

	it("should reject values that are not UPPER_SNAKE_CASE", () => {
		expect(isUpperSnakeCase("")).toBe(false);
		expect(isUpperSnakeCase("error")).toBe(false);
		expect(isUpperSnakeCase("Error")).toBe(false);
		expect(isUpperSnakeCase("1ERROR")).toBe(false);
		expect(isUpperSnakeCase("_ERROR")).toBe(false);
		expect(isUpperSnakeCase("ERROR_")).toBe(false);
		expect(isUpperSnakeCase("ERROR__CODE")).toBe(false);
		expect(isUpperSnakeCase("ERROR-CODE")).toBe(false);
		expect(isUpperSnakeCase("ERROR CODE")).toBe(false);
	});
});

describe("invalidCodeMessage", () => {
	it("should include the invalid code in the message", () => {
		expect(invalidCodeMessage("invalid_Code")).toBe(
			'Código de erro inválido "invalid_Code". Os códigos de erro devem usar UPPER_SNAKE_CASE.',
		);
	});
});
