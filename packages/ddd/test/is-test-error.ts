import { isBaseError } from "@pedrohb/errors";
import { TestError } from "./test-error.js";

export const TEST_ERROR_BRAND = Symbol.for("@pedrohb/ddd/test-error");

export function isTestError(error: unknown): error is TestError {
	return (
		isBaseError(error) &&
		error instanceof TestError &&
		(error as { [TEST_ERROR_BRAND]?: unknown })[TEST_ERROR_BRAND] === true
	);
}
