import { TEST_ERROR_CODES } from "#test/test-error-codes.js";
import { defineErrorCatalog } from "./define-error-catalog.js";
import { InvalidErrorCode } from "./errors/invalid-error-code.js";

describe("defineErrorCatalog", () => {
	it("should create a frozen catalog with frozen descriptors", () => {
		expect(TEST_ERROR_CODES.INTERNAL_SERVER_ERROR).toEqual({
			code: "INTERNAL_SERVER_ERROR",
			message: "Ocorreu um erro interno no servidor.",
		});
		expect(Object.isFrozen(TEST_ERROR_CODES)).toBe(true);
		expect(Object.isFrozen(TEST_ERROR_CODES.INTERNAL_SERVER_ERROR)).toBe(true);
	});

	it("should throw InvalidErrorCode when a code is not UPPER_SNAKE_CASE", () => {
		expect(() =>
			defineErrorCatalog({
				// @ts-expect-error - código intencionalmente inválido para testar
				invalid_Code: "Código inválido.",
			}),
		).toThrow(InvalidErrorCode);
	});
});
