import { Either, error, success } from "@/core/either";
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error";
import { isBefore } from "date-fns";
import { VerificationToken } from "../../enterprise/entities/verification-token";
import { VerificationTokensRepository } from "../repositories/verification-tokens-repository";

interface CreateVerificationTokenUseCaseRequest {
	identifier: string;
	token?: string;
	expiresAt?: Date;
}

type CreateVerificationTokenUseCaseResponse = Either<
	InvalidCredentialsError,
	{
		verificationToken: VerificationToken;
	}
>;

export class CreateVerificationTokenUseCase {
	constructor(
		private verificationTokensRepository: VerificationTokensRepository,
	) {}

	async execute({
		identifier,
		token,
		expiresAt,
	}: CreateVerificationTokenUseCaseRequest): Promise<CreateVerificationTokenUseCaseResponse> {
		if (expiresAt && isBefore(expiresAt, new Date())) {
			return error(new InvalidCredentialsError());
		}

		const verificationToken = VerificationToken.create({
			identifier,
			token,
			expiresAt,
		});

		await this.verificationTokensRepository.create(verificationToken);

		return success({
			verificationToken,
		});
	}
}
