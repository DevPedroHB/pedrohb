import { TestError } from "#test/test-error.js";
import { BaseError } from "./base-error.js";

describe("BaseError", () => {
	it("should create an error with code, interpolated message, name and params", () => {
		const error = TestError.create("METHOD_NOT_IMPLEMENTED", {
			params: {
				method: "anExampleMethod",
			},
		});

		expect(error).toBeInstanceOf(Error);
		expect(error).toBeInstanceOf(BaseError);
		expect(error.code).toBe("METHOD_NOT_IMPLEMENTED");
		expect(error.message).toBe(
			"O método 'anExampleMethod' não está implementado.",
		);
		expect(error.name).toBe("TestError");
		expect(error.params).toStrictEqual({
			method: "anExampleMethod",
		});
	});

	it("should create an error without params", () => {
		const error = TestError.create("INTERNAL_SERVER_ERROR");

		expect(error.message).toBe("Ocorreu um erro interno no servidor.");
		expect(error.params).toBeUndefined();
	});

	it("should store the cause from options", () => {
		const cause = new Error("Causa do erro.");
		const error = TestError.create("INTERNAL_SERVER_ERROR", { cause });

		expect(error.cause).toBe(cause);
	});

	it("should serialize the error", () => {
		const error = TestError.create("METHOD_NOT_IMPLEMENTED", {
			params: {
				method: "anExampleMethod",
			},
		});

		expect(error.serialize()).toStrictEqual({
			code: "METHOD_NOT_IMPLEMENTED",
			message: "O método 'anExampleMethod' não está implementado.",
			name: "TestError",
			params: {
				method: "anExampleMethod",
			},
		});
	});

	it("should serialize the error through toJSON", () => {
		const error = TestError.create("INTERNAL_SERVER_ERROR");

		expect(error.toJSON()).toStrictEqual(error.serialize());
	});

	it("should identify BaseErrors with is", () => {
		const error = TestError.create("INTERNAL_SERVER_ERROR");

		expect(BaseError.is(error)).toBe(true);
		expect(TestError.is(error)).toBe(true);
		expect(BaseError.is(new Error("Mensagem do erro."))).toBe(false);
	});

	it("should serialize a cause with serializeCauseError", () => {
		expect(
			BaseError.serializeCauseError(new Error("Causa do erro.")),
		).toStrictEqual({
			message: "Causa do erro.",
			name: "Error",
		});
	});
});
