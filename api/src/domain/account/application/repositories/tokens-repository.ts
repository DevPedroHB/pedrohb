import { type IToken, Token } from "../../enterprise/entities/token";

export type TTokenFields = Partial<IToken> & {
	id?: string;
};

export abstract class TokensRepository {
	abstract findByFields(fields: TTokenFields): Promise<Token | null>;
	abstract create(token: Token): Promise<void>;
	abstract delete(token: Token): Promise<void>;
}
