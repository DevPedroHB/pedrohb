import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { isBefore } from "date-fns";
import { VerificationToken } from "../../enterprise/entities/verification-token";
import { VerificationTokensRepository } from "../repositories/verification-tokens-repository";

interface UseVerificationTokenUseCaseRequest {
	identifier: string;
	token: string;
}

type UseVerificationTokenUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		verificationToken: VerificationToken;
	}
>;

@Injectable()
export class UseVerificationTokenUseCase {
	constructor(
		private verificationTokensRepository: VerificationTokensRepository,
	) {}

	async execute({
		identifier,
		token,
	}: UseVerificationTokenUseCaseRequest): Promise<UseVerificationTokenUseCaseResponse> {
		const verificationToken =
			await this.verificationTokensRepository.findByFields({
				identifier,
				token,
			});

		if (!verificationToken) {
			return error(new ResourceNotFoundError("Token de verificação"));
		}

		if (isBefore(verificationToken.expiresAt, new Date())) {
			await this.verificationTokensRepository.delete(verificationToken);

			return error(new NotAllowedError());
		}

		await this.verificationTokensRepository.delete(verificationToken);

		return success({
			verificationToken,
		});
	}
}
