import type { TPartialFactory } from "@/core/types/partial-factory";
import { AccountsRepository } from "@/domain/account/application/repositories/accounts-repository";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import {
	Account,
	type IAccount,
} from "@/domain/account/enterprise/entities/account";
import type { IUser } from "@/domain/account/enterprise/entities/user";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { makeUser } from "./user-factory";

interface IAccountFactory {
	user?: TPartialFactory<IUser>;
	account?: TPartialFactory<IAccount>;
}

export function makeAccount(
	override: IAccountFactory = { user: {}, account: {} },
) {
	const user = makeUser(override.user);

	const account = Account.create(
		{
			provider: faker.lorem.word(),
			providerAccountId: faker.string.uuid(),
			type: faker.lorem.word(),
			createdAt: faker.date.past({ refDate: user.createdAt }),
			userId: user.id,
			...override.account,
		},
		override.account.id,
	);

	return {
		user,
		account,
	};
}

@Injectable()
export class AccountFactory {
	constructor(
		private usersRepository: UsersRepository,
		private accountsRepository: AccountsRepository,
	) {}

	async makeAccount(data: IAccountFactory = { user: {}, account: {} }) {
		const { user, account } = makeAccount(data);

		await this.usersRepository.create(user);
		await this.accountsRepository.create(account);

		return {
			user,
			account,
		};
	}
}
