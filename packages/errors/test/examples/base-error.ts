import {
	BaseError,
	type BaseErrorOptions,
	type BaseErrorOptionsArgs,
	type DefaultParamDelimiters,
} from "#/index.js";
import {
	EXAMPLE_ERROR_CODES,
	type ExampleErrorCatalogCode,
	type ExampleErrorCodes,
} from "./catalog.js";
import {
	EXAMPLE_ERROR_TRANSLATIONS,
	type ExampleErrorLocale,
} from "./translations.js";

/** Forma simples: parâmetros convenientes na assinatura da classe. */
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

/** Erro sem placeholders: options e cause são opcionais. */
export class InternalServerError extends BaseError<
	ExampleErrorCodes,
	"INTERNAL_SERVER_ERROR"
> {
	public constructor(options?: ErrorOptions) {
		super(EXAMPLE_ERROR_CODES.INTERNAL_SERVER_ERROR, options);
	}
}

/** Subclasse específica com suporte a tradução. */
export class TranslatedMethodNotImplementedError extends BaseError<
	ExampleErrorCodes,
	"METHOD_NOT_IMPLEMENTED",
	DefaultParamDelimiters,
	ExampleErrorLocale
> {
	public constructor(method: string, options?: ErrorOptions) {
		super(EXAMPLE_ERROR_CODES.METHOD_NOT_IMPLEMENTED, {
			params: { method },
			...options,
		});
	}

	protected override get translations() {
		return EXAMPLE_ERROR_TRANSLATIONS;
	}
}

/** Classe genérica reutilizável (forma recomendada). */
export class ExampleError<
	Code extends ExampleErrorCatalogCode = ExampleErrorCatalogCode,
> extends BaseError<ExampleErrorCodes, Code> {
	public constructor(
		code: Code,
		...args: BaseErrorOptionsArgs<ExampleErrorCodes, Code>
	) {
		super(EXAMPLE_ERROR_CODES[code], ...args);
	}

	public static is(error: unknown): error is ExampleError {
		return error instanceof ExampleError;
	}
}

/** Classe genérica que habilita todos os idiomas do catálogo. */
export class TranslatedExampleError<
	Code extends ExampleErrorCatalogCode = ExampleErrorCatalogCode,
> extends BaseError<
	ExampleErrorCodes,
	Code,
	DefaultParamDelimiters,
	ExampleErrorLocale
> {
	public constructor(
		code: Code,
		...args: BaseErrorOptionsArgs<ExampleErrorCodes, Code>
	) {
		super(EXAMPLE_ERROR_CODES[code], ...args);
	}

	protected override get translations() {
		return EXAMPLE_ERROR_TRANSLATIONS;
	}

	public static is(error: unknown): error is TranslatedExampleError {
		return error instanceof TranslatedExampleError;
	}
}

/** Variante que exige um objeto options explícito no construtor. */
export class ExampleErrorWithRequiredOptions<
	Code extends ExampleErrorCatalogCode,
> extends BaseError<ExampleErrorCodes, Code> {
	public constructor(
		code: Code,
		options: BaseErrorOptions<ExampleErrorCodes, Code>,
	) {
		super(EXAMPLE_ERROR_CODES[code], options);
	}
}
