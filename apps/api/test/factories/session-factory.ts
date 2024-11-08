import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { SessionsRepository } from "@/domain/account/application/repositories/sessions-repository";
import {
	type ISession,
	Session,
} from "@/domain/account/enterprise/entities/session";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeSession(
	override: Partial<ISession> = {},
	id?: UniqueEntityID,
) {
	const session = Session.create(
		{
			sessionToken: faker.string.uuid(),
			expiresAt: faker.date.future(),
			createdAt: faker.date.past(),
			userId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return session;
}

@Injectable()
export class SessionFactory {
	constructor(private sessionsRepository: SessionsRepository) {}

	async makeSession(data: Partial<ISession> = {}, id?: UniqueEntityID) {
		const session = makeSession(data, id);

		await this.sessionsRepository.create(session);

		return session;
	}
}
