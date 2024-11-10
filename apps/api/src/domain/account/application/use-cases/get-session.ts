import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { SessionAndUser } from "../../enterprise/entities/value-objects/session-and-user";
import { SessionsRepository } from "../repositories/sessions-repository";

interface GetSessionUseCaseRequest {
	sessionToken: string;
}

type GetSessionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		sessionAndUser: SessionAndUser;
	}
>;

@Injectable()
export class GetSessionUseCase {
	constructor(private sessionsRepository: SessionsRepository) {}

	async execute({
		sessionToken,
	}: GetSessionUseCaseRequest): Promise<GetSessionUseCaseResponse> {
		const sessionAndUser =
			await this.sessionsRepository.findSessionByToken(sessionToken);

		if (!sessionAndUser) {
			return error(new ResourceNotFoundError("Sessão"));
		}

		return success({
			sessionAndUser,
		});
	}
}
