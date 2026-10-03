import { TestError } from "#test/test-error.js";
import { serializeBaseError } from "./serialize-base-error.js";

describe("serializeBaseError", () => {
	const error = TestError.create("METHOD_NOT_IMPLEMENTED", {
		params: {
			method: "naoImplementado",
		},
	});

	it("should serialize code, message, name and params", () => {
		expect(serializeBaseError(error)).toStrictEqual({
			code: "METHOD_NOT_IMPLEMENTED",
			message: "O método 'naoImplementado' não está implementado.",
			name: "TestError",
			params: {
				method: "naoImplementado",
			},
		});
	});

	it("should omit optional fields when absent", () => {
		expect(
			serializeBaseError(TestError.create("INTERNAL_SERVER_ERROR")),
		).toStrictEqual({
			code: "INTERNAL_SERVER_ERROR",
			message: "Ocorreu um erro interno no servidor.",
			name: "TestError",
		});
	});

	it("should serialize the cause when present", () => {
		const result = serializeBaseError(
			TestError.create("INTERNAL_SERVER_ERROR", {
				cause: new Error("Causa do erro."),
			}),
		);

		expect(result.cause).toStrictEqual({
			message: "Causa do erro.",
			name: "Error",
		});
	});

	it("should include the stack only when requested", () => {
		expect(serializeBaseError(error).stack).toBeUndefined();
		expect(serializeBaseError(error, true).stack).toBe(error.stack);
	});
});
