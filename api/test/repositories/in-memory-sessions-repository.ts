import { matchesFields } from "@/core/functions/matches-fields";
import {
	SessionsRepository,
	type TSessionFields,
} from "@/domain/account/application/repositories/sessions-repository";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { Session } from "@/domain/account/enterprise/entities/session";
import { SessionWithUser } from "@/domain/account/enterprise/entities/value-objects/session-with-user";

export class InMemorySessionsRepository implements SessionsRepository {
	public items: Session[] = [];

	constructor(private usersRepository: UsersRepository) {}

	async findByFields(fields: TSessionFields) {
		return this.items.find((item) => matchesFields(item, fields)) || null;
	}

	async create(session: Session) {
		this.items.push(session);
	}

	async update(session: Session) {
		const index = this.items.findIndex((item) => item.equals(session));

		if (index !== -1) {
			this.items[index] = session;
		}
	}

	async delete(session: Session) {
		const index = this.items.findIndex((item) => item.equals(session));

		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}

	async findSessionByToken(sessionToken: string) {
		const session = this.items.find(
			(item) => item.sessionToken === sessionToken,
		);

		if (!session) {
			return null;
		}

		const user = await this.usersRepository.findByFields({
			id: session.userId.id,
		});

		if (!user) {
			return null;
		}

		return SessionWithUser.create({
			id: session.id,
			sessionToken: session.sessionToken,
			expiresAt: session.expiresAt,
			createdAt: session.createdAt,
			updatedAt: session.updatedAt,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				password: user.password,
				avatarUrl: user.avatarUrl,
				birthdate: user.birthdate,
				role: user.role,
				emailVerifiedAt: user.emailVerifiedAt,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		});
	}
}
