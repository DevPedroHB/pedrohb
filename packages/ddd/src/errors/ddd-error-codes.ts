import {
	type CatalogCode,
	defineErrorCatalog,
	defineErrorTranslations,
	type ErrorTranslationLocale,
} from "@pedrohb/errors";

export const DDD_ERROR_CODES = defineErrorCatalog({
	INTERNAL_SERVER_ERROR: "Ocorreu um erro interno no servidor.",
	METHOD_NOT_IMPLEMENTED: "O método '{method}' não está implementado.",
	INVALID_ENTITY_ID: "O identificador '{id}' é inválido.",
});

export type DDDErrorCodes = typeof DDD_ERROR_CODES;

export type DDDErrorCatalogCode = CatalogCode<DDDErrorCodes>;

export const DDD_ERROR_TRANSLATIONS = defineErrorTranslations(DDD_ERROR_CODES, {
	en: {
		INTERNAL_SERVER_ERROR: "An internal server error has occurred.",
		METHOD_NOT_IMPLEMENTED: "The method '{method}' is not implemented.",
		INVALID_ENTITY_ID: "The identifier '{id}' is invalid.",
	},
});

export type DDDErrorTranslations = typeof DDD_ERROR_TRANSLATIONS;

export type DDDErrorLocale = ErrorTranslationLocale<DDDErrorTranslations>;
