import { Either, success } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Authenticator } from "../../enterprise/entities/authenticator";
import { AuthenticatorsRepository } from "../repositories/authenticators-repository";

interface FetchUserAuthenticatorsUseCaseRequest {
	userId: string;
}

type FetchUserAuthenticatorsUseCaseResponse = Either<
	null,
	{
		authenticators: Authenticator[];
	}
>;

@Injectable()
export class FetchUserAuthenticatorsUseCase {
	constructor(private authenticatorsRepository: AuthenticatorsRepository) {}

	async execute({
		userId,
	}: FetchUserAuthenticatorsUseCaseRequest): Promise<FetchUserAuthenticatorsUseCaseResponse> {
		const authenticators =
			await this.authenticatorsRepository.fetchAuthenticators({
				fields: { userId },
			});

		return success({
			authenticators,
		});
	}
}
