import { DEFAULT_PARAM_DELIMITERS } from "#/functions/create-param-placeholder.js";
import { TEST_ERROR_CODES } from "#test/test-error-codes.js";
import { interpolateErrorMessage } from "./interpolate-error-message.js";
import type { ErrorDescriptor } from "./types/error-descriptor.js";

describe("interpolateErrorMessage", () => {
	const MISSING_PARAM: ErrorDescriptor = {
		code: "MISSING_PARAM",
		message: "Parâmetro ausente: {param}.",
	};

	it("should replace placeholders with the provided params", () => {
		expect(
			interpolateErrorMessage(
				TEST_ERROR_CODES.METHOD_NOT_IMPLEMENTED,
				DEFAULT_PARAM_DELIMITERS,
				{
					method: "anExampleError",
				},
			),
		).toBe("O método 'anExampleError' não está implementado.");
	});

	it("should return the message as-is when it has no placeholders", () => {
		expect(
			interpolateErrorMessage(
				TEST_ERROR_CODES.INTERNAL_SERVER_ERROR,
				DEFAULT_PARAM_DELIMITERS,
			),
		).toBe("Ocorreu um erro interno no servidor.");
	});

	it("should keep the placeholder when the param is missing", () => {
		expect(
			interpolateErrorMessage(MISSING_PARAM, DEFAULT_PARAM_DELIMITERS, {}),
		).toBe("Parâmetro ausente: {param}.");
	});

	it("should ignore empty placeholders and trim whitespace around keys", () => {
		expect(
			interpolateErrorMessage(
				TEST_ERROR_CODES.PLACEHOLDER_EDGE_CASES,
				DEFAULT_PARAM_DELIMITERS,
				{
					key: "valor",
				},
			),
		).toBe("Vazio: {}, espaçado: valor.");
	});

	it("should stringify non-string param values", () => {
		expect(
			interpolateErrorMessage(
				TEST_ERROR_CODES.PARAM_TYPES,
				DEFAULT_PARAM_DELIMITERS,
				{
					name: "John Doe",
					age: 25,
					active: true,
					extra: null,
					bigint: BigInt(42),
				},
			),
		).toBe("nome: John Doe, idade: 25, ativo: true, extra: null, bigint: 42.");
	});
});
