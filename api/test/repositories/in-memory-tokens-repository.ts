import { TokensRepository } from "@/domain/account/application/repositories/tokens-repository";
import { Token } from "@/domain/account/enterprise/entities/token";

export class InMemoryTokensRepository implements TokensRepository {
	public items: Token[] = [];

	async create(token: Token) {
		this.items.push(token);
	}
}
