import type { UseCaseError } from "./use-case-error";

export class AlreadyExistsError extends Error implements UseCaseError {
	constructor(identifier: string) {
		super(`${identifier} already exists.`);
	}
}
