import {
	type CatalogCode,
	defineErrorCatalog,
	defineErrorTranslations,
	type ErrorTranslationLocale,
} from "@pedrohb/errors";

export const TEST_ERROR_CODES = defineErrorCatalog({
	MINIMUM_AGE_NOT_MET: "Você deve ter pelo menos '{age}' anos de idade.",
});

export type TestErrorCodes = typeof TEST_ERROR_CODES;

export type TestErrorCatalogCode = CatalogCode<TestErrorCodes>;

export const TEST_ERROR_TRANSLATIONS = defineErrorTranslations(
	TEST_ERROR_CODES,
	{
		en: {
			MINIMUM_AGE_NOT_MET: "You must be at least '{age}' years old.",
		},
	},
);

export type TestErrorTranslations = typeof TEST_ERROR_TRANSLATIONS;

export type TestErrorLocale = ErrorTranslationLocale<TestErrorTranslations>;
