import {
	TEST_ERROR_CODES,
	TEST_ERROR_TRANSLATIONS,
	type TestErrorLocale,
} from "#test/test-error-codes.js";
import { defineErrorCatalog } from "./define-error-catalog.js";
import { defineErrorTranslations } from "./define-error-translations.js";
import { InvalidErrorTranslation } from "./errors/invalid-error-translation.js";
import { InvalidParamDelimitersError } from "./errors/invalid-param-delimiters-error.js";

const CODES = defineErrorCatalog({
	USER_NOT_FOUND: "Usuário {id} não encontrado em {table}",
	INVALID_TOKEN: "Token inválido",
});

describe("defineErrorTranslations", () => {
	it("should create frozen translations indexed by locale", () => {
		expect(TEST_ERROR_TRANSLATIONS.en.METHOD_NOT_IMPLEMENTED).toBe(
			"The method '{method}' is not implemented.",
		);
		expect(TEST_ERROR_TRANSLATIONS.es.INTERNAL_SERVER_ERROR).toBe(
			"Ocurrió un error interno en el servidor.",
		);
		expect(Object.isFrozen(TEST_ERROR_TRANSLATIONS)).toBe(true);
		expect(Object.isFrozen(TEST_ERROR_TRANSLATIONS.en)).toBe(true);
		expect(Object.isFrozen(TEST_ERROR_TRANSLATIONS.es)).toBe(true);
	});

	it("should infer the locales from the translations", () => {
		expectTypeOf<TestErrorLocale>().toEqualTypeOf<"en" | "es">();
		expectTypeOf(TEST_ERROR_CODES).not.toBeAny();
	});

	it("should not be affected by later changes to the input", () => {
		const input = {
			en: {
				USER_NOT_FOUND: "User {id} not found in {table}",
				INVALID_TOKEN: "Invalid token",
			},
		};

		const translations = defineErrorTranslations(CODES, input);

		input.en.INVALID_TOKEN = "Changed";

		expect(translations.en.INVALID_TOKEN).toBe("Invalid token");
	});

	it("should accept placeholders in a different order, with spaces and repeated", () => {
		const translations = defineErrorTranslations(CODES, {
			en: {
				USER_NOT_FOUND: "In {table}, user { id } was not found ({id})",
				INVALID_TOKEN: "Invalid token",
			},
		});

		expect(translations.en.USER_NOT_FOUND).toBe(
			"In {table}, user { id } was not found ({id})",
		);
	});

	it("should accept an empty set of locales", () => {
		expect(defineErrorTranslations(CODES, {})).toStrictEqual({});
	});

	it("should validate placeholders with custom delimiters", () => {
		const keys = { open: "[", close: "]" } as const;
		const codes = defineErrorCatalog({
			ROUTE_NOT_FOUND: "Rota [route] não encontrada",
		});

		expect(
			defineErrorTranslations(
				codes,
				{ en: { ROUTE_NOT_FOUND: "Route [route] not found" } },
				keys,
			).en.ROUTE_NOT_FOUND,
		).toBe("Route [route] not found");

		expect(() =>
			defineErrorTranslations(
				codes,
				// @ts-expect-error - placeholder diferente do original
				{ en: { ROUTE_NOT_FOUND: "Route [path] not found" } },
				keys,
			),
		).toThrow(InvalidErrorTranslation);
	});

	it("should throw InvalidParamDelimitersError for empty delimiters", () => {
		expect(() =>
			defineErrorTranslations(CODES, {}, { open: "", close: "}" }),
		).toThrow(InvalidParamDelimitersError);
	});

	describe("invalid translations", () => {
		const capture = (fn: () => unknown) => {
			try {
				fn();
			} catch (error) {
				return error as InvalidErrorTranslation;
			}

			throw new Error("Era esperado que a função lançasse um erro.");
		};

		it("should throw when a code is missing", () => {
			const error = capture(() =>
				defineErrorTranslations(CODES, {
					// @ts-expect-error - falta a tradução de INVALID_TOKEN
					en: { USER_NOT_FOUND: "User {id} not found in {table}" },
				}),
			);

			expect(error).toBeInstanceOf(InvalidErrorTranslation);
			expect(error).toBeInstanceOf(TypeError);
			expect(error.name).toBe("InvalidErrorTranslation");
			expect(error.locale).toBe("en");
			expect(error.code).toBe("INVALID_TOKEN");
			expect(error.reason).toBe("missing");
			expect(error.message).toBe(
				'Tradução ausente para o código "INVALID_TOKEN" no idioma "en".',
			);
		});

		it("should throw when a code does not exist in the catalog", () => {
			const error = capture(() =>
				defineErrorTranslations(CODES, {
					en: {
						USER_NOT_FOUND: "User {id} not found in {table}",
						INVALID_TOKEN: "Invalid token",
						// @ts-expect-error - código inexistente no catálogo
						OTHER_CODE: "Other",
					},
				}),
			);

			expect(error).toBeInstanceOf(InvalidErrorTranslation);
			expect(error.locale).toBe("en");
			expect(error.code).toBe("OTHER_CODE");
			expect(error.reason).toBe("unknown");
			expect(error.message).toBe(
				'O código "OTHER_CODE" do idioma "en" não existe no catálogo de erros.',
			);
		});

		it.each([
			["a different name", "User {userId} not found in {table}"],
			["a missing placeholder", "User {id} not found"],
			["an extra placeholder", "User {id} not found in {table} at {time}"],
		])("should throw at runtime when the translation has %s", (_, message) => {
			const error = capture(() =>
				defineErrorTranslations(CODES, {
					en: {
						// mensagem não literal: o compilador não consegue compará-la,
						// então a validação de execução é quem barra
						USER_NOT_FOUND: message,
						INVALID_TOKEN: "Invalid token",
					},
				}),
			);

			expect(error).toBeInstanceOf(InvalidErrorTranslation);
			expect(error.code).toBe("USER_NOT_FOUND");
			expect(error.reason).toBe("placeholders");
			expect(error.message).toBe(
				'Os placeholders da tradução do código "USER_NOT_FOUND" no idioma "en" devem ser os mesmos da mensagem original.',
			);
		});

		it("should reject different placeholders at compile time for literal messages", () => {
			expect(() =>
				defineErrorTranslations(CODES, {
					en: {
						// @ts-expect-error - nome diferente
						USER_NOT_FOUND: "User {userId} not found in {table}",
						INVALID_TOKEN: "Invalid token",
					},
				}),
			).toThrow(InvalidErrorTranslation);

			expect(() =>
				defineErrorTranslations(CODES, {
					en: {
						// @ts-expect-error - placeholder ausente
						USER_NOT_FOUND: "User {id} not found",
						INVALID_TOKEN: "Invalid token",
					},
				}),
			).toThrow(InvalidErrorTranslation);

			expect(() =>
				defineErrorTranslations(CODES, {
					en: {
						// @ts-expect-error - placeholder extra
						USER_NOT_FOUND: "User {id} not found in {table} at {time}",
						INVALID_TOKEN: "Invalid token",
					},
				}),
			).toThrow(InvalidErrorTranslation);
		});

		it("should throw when a translation adds placeholders to a message without any", () => {
			expect(() =>
				defineErrorTranslations(CODES, {
					en: {
						USER_NOT_FOUND: "User {id} not found in {table}",
						// @ts-expect-error - o original não tem placeholders
						INVALID_TOKEN: "Invalid token {token}",
					},
				}),
			).toThrow(InvalidErrorTranslation);
		});

		it("should still validate at runtime when the types are bypassed", () => {
			expect(() =>
				defineErrorTranslations(CODES, {
					en: { USER_NOT_FOUND: 42 },
				} as never),
			).toThrow(InvalidErrorTranslation);
		});
	});
});
