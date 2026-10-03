import { TestError } from "#test/test-error.js";
import { serializeCauseError } from "./serialize-cause-error.js";

describe("serializeCauseError", () => {
	it("should return primitives as-is", () => {
		expect(serializeCauseError("texto")).toBe("texto");
		expect(serializeCauseError(42)).toBe(42);
		expect(serializeCauseError(true)).toBe(true);
		expect(serializeCauseError(null)).toBe(null);
		expect(serializeCauseError(undefined)).toBe(undefined);
	});

	it("should stringify bigint and symbol values", () => {
		expect(serializeCauseError(BigInt(42))).toBe("42");
		expect(serializeCauseError(Symbol("id"))).toBe("Symbol(id)");
	});

	it("should describe functions", () => {
		expect(serializeCauseError(function minhaFuncao() {})).toBe(
			"[Function: minhaFuncao]",
		);
		expect(serializeCauseError(() => {})).toBe("[Function: anonymous]");
	});

	it("should serialize dates as ISO strings", () => {
		expect(serializeCauseError(new Date("2024-01-01T00:00:00.000Z"))).toBe(
			"2024-01-01T00:00:00.000Z",
		);
		expect(serializeCauseError(new Date("invalid"))).toBe("Invalid Date");
	});

	it("should serialize native errors", () => {
		expect(serializeCauseError(new Error("Causa do erro."))).toStrictEqual({
			message: "Causa do erro.",
			name: "Error",
		});
	});

	it("should serialize BaseErrors with their code", () => {
		expect(
			serializeCauseError(TestError.create("INTERNAL_SERVER_ERROR")),
		).toStrictEqual({
			code: "INTERNAL_SERVER_ERROR",
			message: "Ocorreu um erro interno no servidor.",
			name: "TestError",
		});
	});

	it("should serialize nested arrays and objects", () => {
		expect(
			serializeCauseError({
				lista: [1, "dois", null],
			}),
		).toStrictEqual({
			lista: [1, "dois", null],
		});
	});

	it("should mark circular references", () => {
		const cause: Record<string, unknown> = {};

		cause.self = cause;

		expect(serializeCauseError(cause)).toStrictEqual({
			self: "[Circular]",
		});
	});
});
