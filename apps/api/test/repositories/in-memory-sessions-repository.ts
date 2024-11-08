import { matchesFields } from "@/core/functions/matches-fields";
import {
	SessionsRepository,
	type TSessionFields,
} from "@/domain/account/application/repositories/sessions-repository";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { Session } from "@/domain/account/enterprise/entities/session";
import { SessionAndUser } from "@/domain/account/enterprise/entities/value-objects/session-and-user";

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

		return SessionAndUser.create({
			session,
			user,
		});
	}
}
