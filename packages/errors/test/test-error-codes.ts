import {
	type CatalogCode,
	defineErrorCatalog,
	defineErrorTranslations,
	type ErrorTranslationLocale,
} from "#/index.js";

export const TEST_ERROR_CODES = defineErrorCatalog({
	INTERNAL_SERVER_ERROR: "Ocorreu um erro interno no servidor.",
	METHOD_NOT_IMPLEMENTED: "O método '{method}' não está implementado.",
	PLACEHOLDER_EDGE_CASES: "Vazio: {}, espaçado: { key }.",
	PARAM_TYPES:
		"nome: {name}, idade: {age}, ativo: {active}, extra: {extra}, bigint: {bigint}.",
});

export type TestErrorCodes = typeof TEST_ERROR_CODES;

export type TestErrorCatalogCode = CatalogCode<TestErrorCodes>;

export const TEST_ERROR_TRANSLATIONS = defineErrorTranslations(
	TEST_ERROR_CODES,
	{
		en: {
			INTERNAL_SERVER_ERROR: "An internal server error occurred.",
			METHOD_NOT_IMPLEMENTED: "The method '{method}' is not implemented.",
			PLACEHOLDER_EDGE_CASES: "Empty: {}, spaced: { key }.",
			PARAM_TYPES:
				"name: {name}, age: {age}, active: {active}, extra: {extra}, bigint: {bigint}.",
		},
		es: {
			INTERNAL_SERVER_ERROR: "Ocurrió un error interno en el servidor.",
			METHOD_NOT_IMPLEMENTED: "El método '{method}' no está implementado.",
			PLACEHOLDER_EDGE_CASES: "Vacío: {}, espaciado: { key }.",
			PARAM_TYPES:
				"nombre: {name}, edad: {age}, activo: {active}, extra: {extra}, bigint: {bigint}.",
		},
	},
);

export type TestErrorTranslations = typeof TEST_ERROR_TRANSLATIONS;

export type TestErrorLocale = ErrorTranslationLocale<TestErrorTranslations>;
