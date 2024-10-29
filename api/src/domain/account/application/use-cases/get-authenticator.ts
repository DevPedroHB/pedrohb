import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Authenticator } from "../../enterprise/entities/authenticator";
import { AuthenticatorsRepository } from "../repositories/authenticators-repository";

interface GetAuthenticatorUseCaseRequest {
	credentialId: string;
}

type GetAuthenticatorUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		authenticator: Authenticator;
	}
>;

export class GetAuthenticatorUseCase {
	constructor(private authenticatorsRepository: AuthenticatorsRepository) {}

	async execute({
		credentialId,
	}: GetAuthenticatorUseCaseRequest): Promise<GetAuthenticatorUseCaseResponse> {
		const authenticator = await this.authenticatorsRepository.findByFields({
			credentialId,
		});

		if (!authenticator) {
			return error(new ResourceNotFoundError("Authenticator"));
		}

		return success({
			authenticator,
		});
	}
}
