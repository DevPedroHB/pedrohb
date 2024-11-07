import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SessionWithUser } from "../../enterprise/entities/value-objects/session-with-user";
import { SessionsRepository } from "../repositories/sessions-repository";

interface GetSessionUseCaseRequest {
	sessionToken: string;
}

type GetSessionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		session: SessionWithUser;
	}
>;

export class GetSessionUseCase {
	constructor(private sessionsRepository: SessionsRepository) {}

	async execute({
		sessionToken,
	}: GetSessionUseCaseRequest): Promise<GetSessionUseCaseResponse> {
		const session =
			await this.sessionsRepository.findSessionByToken(sessionToken);

		if (!session) {
			return error(new ResourceNotFoundError("Sessão"));
		}

		return success({
			session,
		});
	}
}
