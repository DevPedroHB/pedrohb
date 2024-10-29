import { Token } from "../../enterprise/entities/token";

export abstract class TokensRepository {
	abstract create(token: Token): Promise<void>;
}
