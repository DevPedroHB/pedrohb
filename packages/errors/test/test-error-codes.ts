import { type CatalogCode, defineErrorCatalog } from "#/index.js";

export const TEST_ERROR_CODES = defineErrorCatalog({
	INTERNAL_SERVER_ERROR: "Ocorreu um erro interno no servidor.",
	METHOD_NOT_IMPLEMENTED: "O método '{method}' não está implementado.",
	PLACEHOLDER_EDGE_CASES: "Vazio: {}, espaçado: { key }.",
	PARAM_TYPES:
		"nome: {name}, idade: {age}, ativo: {active}, extra: {extra}, bigint: {bigint}.",
});

export type TestErrorCodes = typeof TEST_ERROR_CODES;

export type TestErrorCatalogCode = CatalogCode<TestErrorCodes>;
