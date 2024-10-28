import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	Account,
	type IAccount,
} from "@/domain/account/enterprise/entities/account";
import { faker } from "@faker-js/faker";
import { makeUser } from "./make-user";

export function makeAccount(
	override: Partial<IAccount> = {},
	id?: UniqueEntityID,
) {
	const user = makeUser();

	const account = Account.create(
		{
			provider: faker.lorem.word(),
			providerAccountId: faker.string.uuid(),
			type: faker.lorem.word(),
			createdAt: faker.date.past({ refDate: user.createdAt }),
			userId: user.id,
			...override,
		},
		id,
	);

	return {
		user,
		account,
	};
}
