import {
	BaseError,
	type CatalogCode,
	defineErrorCatalog,
	defineErrorTranslations,
	type ErrorTranslationLocale,
} from "#/index.js";

export const EXAMPLE_ERROR_CODES = defineErrorCatalog({
	INTERNAL_SERVER_ERROR: "Ocorreu um erro interno no servidor.",
	METHOD_NOT_IMPLEMENTED: "O método '{method}' não está implementado.",
});

export type ExampleErrorCodes = typeof EXAMPLE_ERROR_CODES;

export type ExampleErrorCatalogCode = CatalogCode<ExampleErrorCodes>;

export const EXAMPLE_ERROR_TRANSLATIONS = defineErrorTranslations(
	EXAMPLE_ERROR_CODES,
	{
		en: {
			INTERNAL_SERVER_ERROR: "An internal server error occurred.",
			METHOD_NOT_IMPLEMENTED: "The method '{method}' is not implemented.",
		},
		es: {
			INTERNAL_SERVER_ERROR: "Se ha producido un error interno del servidor.",
			METHOD_NOT_IMPLEMENTED: "El método '{method}' no está implementado.",
		},
	},
);

export type ExampleErrorTranslations = typeof EXAMPLE_ERROR_TRANSLATIONS;

export type ExampleErrorLocale =
	ErrorTranslationLocale<ExampleErrorTranslations>;

export class MethodNotImplementedError extends BaseError<
	ExampleErrorCodes,
	"METHOD_NOT_IMPLEMENTED"
> {
	public constructor(method: string, options?: ErrorOptions) {
		super(EXAMPLE_ERROR_CODES.METHOD_NOT_IMPLEMENTED, {
			params: { method },
			...options,
		});
	}
}
