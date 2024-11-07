import type { TPartialFactory } from "@/core/types/partial-factory";
import { SessionsRepository } from "@/domain/account/application/repositories/sessions-repository";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import {
	type ISession,
	Session,
} from "@/domain/account/enterprise/entities/session";
import type { IUser } from "@/domain/account/enterprise/entities/user";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { makeUser } from "./user-factory";

interface ISessionFactory {
	user?: TPartialFactory<IUser>;
	session?: TPartialFactory<ISession>;
}

export function makeSession(override: ISessionFactory = {}) {
	const user = makeUser(override.user);

	const session = Session.create(
		{
			sessionToken: faker.string.uuid(),
			expiresAt: faker.date.future(),
			createdAt: faker.date.past({ refDate: user.createdAt }),
			userId: user.id,
			...override,
		},
		override.session.id,
	);

	return {
		user,
		session,
	};
}

@Injectable()
export class SessionFactory {
	constructor(
		private usersRepository: UsersRepository,
		private sessionsRepository: SessionsRepository,
	) {}

	async makeSession(data: ISessionFactory = {}) {
		const { user, session } = makeSession(data);

		await this.usersRepository.create(user);
		await this.sessionsRepository.create(session);

		return {
			user,
			session,
		};
	}
}
