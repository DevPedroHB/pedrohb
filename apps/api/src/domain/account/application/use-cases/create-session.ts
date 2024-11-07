import { Either, error, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { Session } from "../../enterprise/entities/session";
import { SessionsRepository } from "../repositories/sessions-repository";

interface CreateSessionUseCaseRequest {
	sessionToken: string;
	expiresAt: Date;
	userId: string;
}

type CreateSessionUseCaseResponse = Either<
	AlreadyExistsError,
	{
		session: Session;
	}
>;

export class CreateSessionUseCase {
	constructor(private sessionsRepository: SessionsRepository) {}

	async execute({
		sessionToken,
		expiresAt,
		userId,
	}: CreateSessionUseCaseRequest): Promise<CreateSessionUseCaseResponse> {
		const sessionAlreadyExits = await this.sessionsRepository.findByFields({
			sessionToken,
		});

		if (sessionAlreadyExits) {
			return error(new AlreadyExistsError("Sessão"));
		}

		const session = Session.create({
			sessionToken,
			expiresAt,
			userId: new UniqueEntityID(userId),
		});

		await this.sessionsRepository.create(session);

		return success({
			session,
		});
	}
}
