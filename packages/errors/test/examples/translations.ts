import {
	defineErrorTranslations,
	type ErrorTranslationLocale,
} from "#/index.js";
import { EXAMPLE_ERROR_CODES } from "./catalog.js";

export const EXAMPLE_ERROR_TRANSLATIONS = defineErrorTranslations(
	EXAMPLE_ERROR_CODES,
	{
		en: {
			INTERNAL_SERVER_ERROR: "An internal server error occurred.",
			METHOD_NOT_IMPLEMENTED: "The method '{method}' is not implemented.",
			USER_NOT_FOUND: "User '{userId}' was not found.",
			VALIDATION_FAILED: "Field '{field}' received value '{value}'.",
		},
		es: {
			INTERNAL_SERVER_ERROR: "Se ha producido un error interno del servidor.",
			METHOD_NOT_IMPLEMENTED: "El método '{method}' no está implementado.",
			USER_NOT_FOUND: "No se encontró al usuario '{userId}'.",
			VALIDATION_FAILED: "El campo '{field}' recibió el valor '{value}'.",
		},
	},
);

export type ExampleErrorTranslations = typeof EXAMPLE_ERROR_TRANSLATIONS;
export type ExampleErrorLocale =
	ErrorTranslationLocale<ExampleErrorTranslations>;

export const exampleEnglishMessage =
	EXAMPLE_ERROR_TRANSLATIONS.en.USER_NOT_FOUND;

/** Placeholders podem mudar de ordem, mas os nomes devem ser correspondentes. */
export const REORDERED_PLACEHOLDER_TRANSLATIONS = defineErrorTranslations(
	EXAMPLE_ERROR_CODES,
	{
		en: {
			INTERNAL_SERVER_ERROR: "An internal server error occurred.",
			METHOD_NOT_IMPLEMENTED: "'{method}' is a method that is not implemented.",
			USER_NOT_FOUND: "The user was not found (id: '{userId}').",
			VALIDATION_FAILED:
				"Received '{value}' for the '{field}' field; expected another value.",
		},
	},
);
