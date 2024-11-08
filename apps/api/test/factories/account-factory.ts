import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AccountsRepository } from "@/domain/account/application/repositories/accounts-repository";
import {
	Account,
	type IAccount,
} from "@/domain/account/enterprise/entities/account";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAccount(
	override: Partial<IAccount> = {},
	id?: UniqueEntityID,
) {
	const account = Account.create(
		{
			provider: faker.lorem.word(),
			providerAccountId: faker.string.uuid(),
			type: faker.lorem.word(),
			createdAt: faker.date.past(),
			userId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return account;
}

@Injectable()
export class AccountFactory {
	constructor(private accountsRepository: AccountsRepository) {}

	async makeAccount(data: Partial<IAccount> = {}, id?: UniqueEntityID) {
		const account = makeAccount(data, id);

		await this.accountsRepository.create(account);

		return account;
	}
}
