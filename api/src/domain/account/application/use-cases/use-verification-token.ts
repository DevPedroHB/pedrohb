import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { isBefore } from "date-fns";
import { Token } from "../../enterprise/entities/token";
import { TokensRepository } from "../repositories/tokens-repository";

interface UseVerificationTokenUseCaseRequest {
	identifier: string;
	token: string;
}

type UseVerificationTokenUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		token: Token;
	}
>;

export class UseVerificationTokenUseCase {
	constructor(private tokensRepository: TokensRepository) {}

	async execute({
		identifier,
		token,
	}: UseVerificationTokenUseCaseRequest): Promise<UseVerificationTokenUseCaseResponse> {
		const tokenExists = await this.tokensRepository.findByFields({
			identifier,
			token,
		});

		if (!tokenExists) {
			return error(new ResourceNotFoundError("Token"));
		}

		if (isBefore(tokenExists.expiresAt, new Date())) {
			await this.tokensRepository.delete(tokenExists);

			return error(new NotAllowedError());
		}

		await this.tokensRepository.delete(tokenExists);

		return success({
			token: tokenExists,
		});
	}
}
