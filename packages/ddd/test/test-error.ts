import {
	BaseError,
	type BaseErrorOptionsArgs,
	type DefaultParamDelimiters,
} from "@pedrohb/errors";
import { isTestError, TEST_ERROR_BRAND } from "./is-test-error.js";
import {
	TEST_ERROR_CODES,
	TEST_ERROR_TRANSLATIONS,
	type TestErrorCatalogCode,
	type TestErrorCodes,
	type TestErrorLocale,
} from "./test-error-codes.js";

export class TestError<
	Code extends TestErrorCatalogCode = TestErrorCatalogCode,
> extends BaseError<
	TestErrorCodes,
	Code,
	DefaultParamDelimiters,
	TestErrorLocale
> {
	public constructor(
		code: Code,
		...args: BaseErrorOptionsArgs<TestErrorCodes, Code>
	) {
		super(TEST_ERROR_CODES[code], ...args);
	}

	protected override get translations() {
		return TEST_ERROR_TRANSLATIONS;
	}

	public get [TEST_ERROR_BRAND]() {
		return true;
	}

	public static is(error: unknown): error is TestError {
		return isTestError(error);
	}
}
