import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { type IToken, Token } from "@/domain/account/enterprise/entities/token";
import { faker } from "@faker-js/faker";

export function makeToken(override: Partial<IToken> = {}, id?: UniqueEntityID) {
	const token = Token.create(
		{
			identifier: faker.lorem.word(),
			...override,
		},
		id,
	);

	return token;
}
