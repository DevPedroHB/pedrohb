import { BaseError, type BaseErrorOptionsArgs } from "#/index.js";
import {
	TEST_ERROR_CODES,
	type TestErrorCatalogCode,
	type TestErrorCodes,
} from "./test-error-codes.js";

export class TestError<
	Code extends TestErrorCatalogCode = TestErrorCatalogCode,
> extends BaseError<TestErrorCodes, Code> {
	protected constructor(
		code: Code,
		...args: BaseErrorOptionsArgs<TestErrorCodes, Code>
	) {
		super(TEST_ERROR_CODES[code], ...args);
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
