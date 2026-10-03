import { TestError } from "#test/test-error.js";
import { isBaseError } from "./is-base-error.js";

describe("isBaseError", () => {
	it("should return true for a BaseError instance", () => {
		expect(isBaseError(TestError.create("INTERNAL_SERVER_ERROR"))).toBe(true);
	});

	it("should return false for a native Error", () => {
		expect(isBaseError(new Error("Mensagem do erro."))).toBe(false);
	});

	it("should return false for non-Error values", () => {
		expect(isBaseError(null)).toBe(false);
		expect(isBaseError(undefined)).toBe(false);
		expect(isBaseError("Mensagem do erro.")).toBe(false);
		expect(isBaseError({})).toBe(false);
	});
});
