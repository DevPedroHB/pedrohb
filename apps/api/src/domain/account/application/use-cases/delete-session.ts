import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Session } from "../../enterprise/entities/session";
import { SessionsRepository } from "../repositories/sessions-repository";

interface DeleteSessionUseCaseRequest {
	sessionToken: string;
}

type DeleteSessionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		session: Session;
	}
>;

export class DeleteSessionUseCase {
	constructor(private sessionsRepository: SessionsRepository) {}

	async execute({
		sessionToken,
	}: DeleteSessionUseCaseRequest): Promise<DeleteSessionUseCaseResponse> {
		const session = await this.sessionsRepository.findByFields({
			sessionToken,
		});

		if (!session) {
			return error(new ResourceNotFoundError("Sessão"));
		}

		await this.sessionsRepository.delete(session);

		return success({
			session,
		});
	}
}
