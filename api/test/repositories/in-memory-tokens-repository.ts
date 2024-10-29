import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	type TTokenFields,
	TokensRepository,
} from "@/domain/account/application/repositories/tokens-repository";
import { Token } from "@/domain/account/enterprise/entities/token";

export class InMemoryTokensRepository implements TokensRepository {
	public items: Token[] = [];

	private matchesFields(item: Token, fields: TTokenFields) {
		return Object.entries(fields).every(([key, value]) => {
			if (item[key] instanceof UniqueEntityID) {
				return item[key].equals(new UniqueEntityID(String(value)));
			}

			return item[key] === value;
		});
	}

	async findByFields(fields: TTokenFields) {
		return this.items.find((item) => this.matchesFields(item, fields)) || null;
	}

	async create(token: Token) {
		this.items.push(token);
	}

	async delete(token: Token) {
		const index = this.items.findIndex((item) => item.equals(token));

		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}
}
