import {
	BaseError,
	type BaseErrorOptionsArgs,
	type DefaultParamDelimiters,
} from "#/index.js";
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
	protected constructor(
		code: Code,
		...args: BaseErrorOptionsArgs<TestErrorCodes, Code>
	) {
		super(TEST_ERROR_CODES[code], ...args);
	}

	protected override get translations() {
		return TEST_ERROR_TRANSLATIONS;
	}

	public static is(error: unknown): error is TestError {
		return error instanceof TestError;
	}

	public static create<
		Code extends TestErrorCatalogCode = TestErrorCatalogCode,
	>(code: Code, ...args: BaseErrorOptionsArgs<TestErrorCodes, Code>) {
		return new TestError(code, ...args);
	}
}
