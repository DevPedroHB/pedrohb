import { UseCaseError } from "./use-case-error";

export class ResourceNotFoundError extends Error implements UseCaseError {
	constructor() {
		super(
			"Recurso não encontrado. Verifique se o recurso solicitado existe e tente novamente.",
		);
	}
}
