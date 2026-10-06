import { TestError } from "#test/test-error.js";
import { BaseError } from "./base-error.js";
import { defineErrorCatalog } from "./define-error-catalog.js";
import { defineErrorTranslations } from "./define-error-translations.js";

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

	describe("translate", () => {
		it("should translate the message and interpolate the params", () => {
			const error = TestError.create("METHOD_NOT_IMPLEMENTED", {
				params: { method: "anExampleMethod" },
			});

			expect(error.translate("en")).toBe(
				"The method 'anExampleMethod' is not implemented.",
			);
			expect(error.translate("es")).toBe(
				"El método 'anExampleMethod' no está implementado.",
			);
		});

		it("should translate messages without placeholders", () => {
			const error = TestError.create("INTERNAL_SERVER_ERROR");

			expect(error.translate("en")).toBe("An internal server error occurred.");
		});

		it("should translate every param type", () => {
			const error = TestError.create("PARAM_TYPES", {
				params: {
					name: "Ana",
					age: 30,
					active: true,
					extra: null,
					bigint: 10n,
				},
			});

			expect(error.translate("en")).toBe(
				"name: Ana, age: 30, active: true, extra: null, bigint: 10.",
			);
		});

		it("should keep empty and unknown placeholders as they are", () => {
			const error = TestError.create("PLACEHOLDER_EDGE_CASES", {
				params: { key: "valor" },
			});

			expect(error.translate("en")).toBe("Empty: {}, spaced: valor.");
		});

		it("should not change message, params or serialization", () => {
			const error = TestError.create("METHOD_NOT_IMPLEMENTED", {
				params: { method: "anExampleMethod" },
			});

			error.translate("en");

			expect(error.message).toBe(
				"O método 'anExampleMethod' não está implementado.",
			);
			expect(error.serialize()).toStrictEqual({
				code: "METHOD_NOT_IMPLEMENTED",
				message: "O método 'anExampleMethod' não está implementado.",
				name: "TestError",
				params: { method: "anExampleMethod" },
			});
		});

		it("should not expose translations or delimiters as own properties", () => {
			const error = TestError.create("INTERNAL_SERVER_ERROR");

			expect(Object.keys(error)).not.toContain("translations");
			expect(Object.keys(error)).not.toContain("delimiters");
			expect(JSON.stringify(error)).not.toContain("An internal server error");
		});

		it("should only accept the defined locales", () => {
			const error = TestError.create("INTERNAL_SERVER_ERROR");

			// @ts-expect-error - "fr" não existe em TEST_ERROR_TRANSLATIONS
			error.translate("fr");
		});

		it("should fall back to the message when the locale has no translation at runtime", () => {
			const error = TestError.create("INTERNAL_SERVER_ERROR");

			expect(error.translate("fr" as never)).toBe(error.message);
			expect(error.translate("constructor" as never)).toBe(error.message);
		});

		it("should fall back to the message in classes without translations", () => {
			const codes = defineErrorCatalog({ INVALID_TOKEN: "Token inválido" });

			class PlainError extends BaseError<typeof codes, "INVALID_TOKEN"> {
				public constructor() {
					super(codes.INVALID_TOKEN);
				}
			}

			const error = new PlainError();

			// @ts-expect-error - sem traduções, nenhum idioma é aceito
			expect(error.translate("en")).toBe("Token inválido");
		});

		it("should interpolate translations with the delimiters of the error", () => {
			const keys = { open: "[", close: "]" } as const;
			const codes = defineErrorCatalog({
				ROUTE_NOT_FOUND: "Rota [route] não encontrada",
			});
			const translations = defineErrorTranslations(
				codes,
				{ en: { ROUTE_NOT_FOUND: "Route [route] not found" } },
				keys,
			);

			class RouteError extends BaseError<
				typeof codes,
				"ROUTE_NOT_FOUND",
				typeof keys,
				"en"
			> {
				protected override get translations() {
					return translations;
				}

				public constructor(route: string) {
					super(codes.ROUTE_NOT_FOUND, { params: { route }, delimiters: keys });
				}
			}

			const error = new RouteError("/home");

			expect(error.message).toBe("Rota /home não encontrada");
			expect(error.translate("en")).toBe("Route /home not found");
		});
	});
});
