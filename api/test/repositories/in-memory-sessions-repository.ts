import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	SessionsRepository,
	type TSessionFields,
} from "@/domain/account/application/repositories/sessions-repository";
import { Session } from "@/domain/account/enterprise/entities/session";

export class InMemorySessionsRepository implements SessionsRepository {
	public items: Session[] = [];

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
}
