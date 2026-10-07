import { BaseError } from "@pedrohb/errors";
import { DDDError } from "./ddd-error.js";

export const DDD_ERROR_BRAND = Symbol.for("@pedrohb/ddd/ddd-error");

export function isDDDError(error: unknown): error is DDDError {
	return (
		error instanceof Error &&
		error instanceof BaseError &&
		error instanceof DDDError &&
		(error as { [DDD_ERROR_BRAND]?: unknown })[DDD_ERROR_BRAND] === true
	);
}
