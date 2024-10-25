import { UseCaseError } from "./use-case-error";

export class NotAllowedError extends Error implements UseCaseError {
	constructor() {
		super(
			"Ação não permitida. Você não tem permissão para realizar esta operação.",
		);
	}
}
