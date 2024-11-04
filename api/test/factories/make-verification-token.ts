import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	type IVerificationToken,
	VerificationToken,
} from "@/domain/account/enterprise/entities/verification-token";
import { faker } from "@faker-js/faker";

export function makeVerificationToken(
	override: Partial<IVerificationToken> = {},
	id?: UniqueEntityID,
) {
	const token = VerificationToken.create(
		{
			identifier: faker.lorem.word(),
			...override,
		},
		id,
	);

	return token;
}
