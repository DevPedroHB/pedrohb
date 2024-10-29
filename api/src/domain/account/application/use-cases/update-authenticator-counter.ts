import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Authenticator } from "../../enterprise/entities/authenticator";
import { AuthenticatorsRepository } from "../repositories/authenticators-repository";

interface UpdateAuthenticatorCounterUseCaseRequest {
	credentialId: string;
	counter: number;
}

type UpdateAuthenticatorCounterUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		authenticator: Authenticator;
	}
>;

export class UpdateAuthenticatorCounterUseCase {
	constructor(private authenticatorsRepository: AuthenticatorsRepository) {}

	async execute({
		credentialId,
		counter,
	}: UpdateAuthenticatorCounterUseCaseRequest): Promise<UpdateAuthenticatorCounterUseCaseResponse> {
		const authenticator = await this.authenticatorsRepository.findByFields({
			credentialId,
		});

		if (!authenticator) {
			return error(new ResourceNotFoundError("Autenticador"));
		}

		authenticator.counter = counter;

		await this.authenticatorsRepository.update(authenticator);

		return success({
			authenticator,
		});
	}
}
