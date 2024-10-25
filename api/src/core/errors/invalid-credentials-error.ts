import { UseCaseError } from "./use-case-error";

export class InvalidCredentialsError extends Error implements UseCaseError {
	constructor() {
		super(
			"As credenciais estão incorretas. Verifique as informações e tente novamente.",
		);
	}
}
