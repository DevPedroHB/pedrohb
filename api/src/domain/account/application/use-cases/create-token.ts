import { Either, error, success } from "@/core/either";
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error";
import { isBefore } from "date-fns";
import { Token } from "../../enterprise/entities/token";
import { TokensRepository } from "../repositories/tokens-repository";

interface CreateTokenUseCaseRequest {
	identifier: string;
	token?: string;
	expiresAt?: Date;
}

type CreateTokenUseCaseResponse = Either<
	InvalidCredentialsError,
	{
		token: Token;
	}
>;

export class CreateTokenUseCase {
	constructor(private tokensRepository: TokensRepository) {}

	async execute({
		identifier,
		token,
		expiresAt,
	}: CreateTokenUseCaseRequest): Promise<CreateTokenUseCaseResponse> {
		if (expiresAt && isBefore(expiresAt, new Date())) {
			return error(new InvalidCredentialsError());
		}

		const tokenClass = Token.create({
			identifier,
			token,
			expiresAt,
		});

		await this.tokensRepository.create(tokenClass);

		return success({
			token: tokenClass,
		});
	}
}
