import { UniqueEntityID } from "@/core/entities/unique-entity-id";
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

	private matchesFields(item: Session, fields: TSessionFields) {
		return Object.entries(fields).every(([key, value]) => {
			if (item[key] instanceof UniqueEntityID) {
				return item[key].equals(new UniqueEntityID(String(value)));
			}

			return item[key] === value;
		});
	}

	async findByFields(fields: TSessionFields) {
		return this.items.find((item) => this.matchesFields(item, fields)) || null;
	}

	async create(session: Session) {
		this.items.push(session);
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
