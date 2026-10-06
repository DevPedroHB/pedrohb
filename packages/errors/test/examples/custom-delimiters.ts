import {
	BaseError,
	type BaseErrorOptionsArgs,
	type CatalogCode,
	defineErrorCatalog,
	defineErrorTranslations,
	type ErrorParamDelimiters,
	type ErrorTranslationLocale,
} from "#/index.js";

export const ANGLE_BRACKET_DELIMITERS = {
	open: "<",
	close: ">",
} as const satisfies ErrorParamDelimiters;

export const CUSTOM_DELIMITER_CODES = defineErrorCatalog({
	RESOURCE_NOT_FOUND: "Recurso <resource> não encontrado no tenant <tenant>.",
	OPERATION_FAILED: "A operação falhou.",
});

export type CustomDelimiterCodes = typeof CUSTOM_DELIMITER_CODES;

export const CUSTOM_DELIMITER_TRANSLATIONS = defineErrorTranslations(
	CUSTOM_DELIMITER_CODES,
	{
		en: {
			RESOURCE_NOT_FOUND:
				"Resource <resource> was not found in tenant <tenant>.",
			OPERATION_FAILED: "The operation failed.",
		},
	},
	ANGLE_BRACKET_DELIMITERS,
);

export type CustomDelimiterLocale = ErrorTranslationLocale<
	typeof CUSTOM_DELIMITER_TRANSLATIONS
>;

export class CustomDelimiterError<
	Code extends
		CatalogCode<CustomDelimiterCodes> = CatalogCode<CustomDelimiterCodes>,
> extends BaseError<
	CustomDelimiterCodes,
	Code,
	typeof ANGLE_BRACKET_DELIMITERS,
	CustomDelimiterLocale
> {
	public constructor(
		code: Code,
		...args: BaseErrorOptionsArgs<
			CustomDelimiterCodes,
			Code,
			typeof ANGLE_BRACKET_DELIMITERS
		>
	) {
		super(CUSTOM_DELIMITER_CODES[code], ...args);
	}

	protected override get translations() {
		return CUSTOM_DELIMITER_TRANSLATIONS;
	}
}
