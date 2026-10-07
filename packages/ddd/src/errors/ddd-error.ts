import {
	BaseError,
	type BaseErrorOptionsArgs,
	type DefaultParamDelimiters,
} from "@pedrohb/errors";
import {
	DDD_ERROR_CODES,
	DDD_ERROR_TRANSLATIONS,
	type DDDErrorCatalogCode,
	type DDDErrorCodes,
	type DDDErrorLocale,
} from "./ddd-error-codes.js";
import { DDD_ERROR_BRAND, isDDDError } from "./is-ddd-error.js";

export class DDDError<
	Code extends DDDErrorCatalogCode = DDDErrorCatalogCode,
> extends BaseError<
	DDDErrorCodes,
	Code,
	DefaultParamDelimiters,
	DDDErrorLocale
> {
	public constructor(
		code: Code,
		...args: BaseErrorOptionsArgs<DDDErrorCodes, Code>
	) {
		super(DDD_ERROR_CODES[code], ...args);
	}

	protected override get translations() {
		return DDD_ERROR_TRANSLATIONS;
	}

	public get [DDD_ERROR_BRAND]() {
		return true;
	}

	public static is(error: unknown): error is DDDError {
		return isDDDError(error);
	}
}
