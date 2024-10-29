import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { type IToken, Token } from "@/domain/account/enterprise/entities/token";

export function makeToken(override: Partial<IToken> = {}, id?: UniqueEntityID) {
	const token = Token.create(
		{
			identifier: "email",
			...override,
		},
		id,
	);

	return token;
}
