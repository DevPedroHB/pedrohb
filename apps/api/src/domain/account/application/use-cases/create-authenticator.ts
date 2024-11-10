import { Either, error, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { Injectable } from "@nestjs/common";
import { Authenticator } from "../../enterprise/entities/authenticator";
import { AuthenticatorsRepository } from "../repositories/authenticators-repository";

interface CreateAuthenticatorUseCaseRequest {
	credentialId: string;
	providerAccountId: string;
	credentialPublicKey: string;
	counter: number;
	credentialDeviceType: string;
	credentialBackedUp: boolean;
	transports?: string | null;
	userId: string;
}

type CreateAuthenticatorUseCaseResponse = Either<
	AlreadyExistsError,
	{
		authenticator: Authenticator;
	}
>;

@Injectable()
export class CreateAuthenticatorUseCase {
	constructor(private authenticatorsRepository: AuthenticatorsRepository) {}

	async execute({
		credentialId,
		providerAccountId,
		credentialPublicKey,
		counter,
		credentialDeviceType,
		credentialBackedUp,
		transports,
		userId,
	}: CreateAuthenticatorUseCaseRequest): Promise<CreateAuthenticatorUseCaseResponse> {
		const authenticatorWithSameCredentialId =
			await this.authenticatorsRepository.findByFields({ credentialId });

		if (authenticatorWithSameCredentialId) {
			return error(new AlreadyExistsError("Autenticador"));
		}

		const authenticator = Authenticator.create({
			credentialId,
			providerAccountId,
			credentialPublicKey,
			counter,
			credentialDeviceType,
			credentialBackedUp,
			transports,
			userId: new UniqueEntityID(userId),
		});

		await this.authenticatorsRepository.create(authenticator);

		return success({
			authenticator,
		});
	}
}
