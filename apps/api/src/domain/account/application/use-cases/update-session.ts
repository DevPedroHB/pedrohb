import { Either, error, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Session } from "../../enterprise/entities/session";
import { SessionsRepository } from "../repositories/sessions-repository";

interface UpdateSessionUseCaseRequest {
	sessionToken: string;
	expiresAt?: Date | null;
	userId?: string | null;
}

type UpdateSessionUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		session: Session;
	}
>;

@Injectable()
export class UpdateSessionUseCase {
	constructor(private sessionsRepository: SessionsRepository) {}

	async execute({
		sessionToken,
		expiresAt,
		userId,
	}: UpdateSessionUseCaseRequest): Promise<UpdateSessionUseCaseResponse> {
		const session = await this.sessionsRepository.findByFields({
			sessionToken,
		});

		if (!session) {
			return error(new ResourceNotFoundError("Sessão"));
		}

		session.sessionToken = sessionToken;

		if (expiresAt) {
			session.expiresAt = expiresAt;
		}

		if (userId) {
			session.userId = new UniqueEntityID(userId);
		}

		await this.sessionsRepository.update(session);

		return success({
			session,
		});
	}
}
