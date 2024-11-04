import { matchesFields } from "@/core/functions/matches-fields";
import {
	AccountsRepository,
	type TAccountFields,
} from "@/domain/account/application/repositories/accounts-repository";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { Account } from "@/domain/account/enterprise/entities/account";
import { AccountWithUser } from "@/domain/account/enterprise/entities/value-objects/account-with-user";

export class InMemoryAccountsRepository implements AccountsRepository {
	public items: Account[] = [];

	constructor(private usersRepository: UsersRepository) {}

	async findByFields(fields: TAccountFields) {
		return this.items.find((item) => matchesFields(item, fields)) || null;
	}

	async create(account: Account) {
		this.items.push(account);
	}

	async delete(account: Account) {
		const index = this.items.findIndex((item) => item.equals(account));

		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}

	async findByProviderId(provider: string, providerAccountId: string) {
		const account = this.items.find(
			(item) =>
				item.provider === provider &&
				item.providerAccountId === providerAccountId,
		);

		if (!account) {
			return null;
		}

		const user = await this.usersRepository.findByFields({
			id: account.userId.id,
		});

		if (!user) {
			return null;
		}

		return AccountWithUser.create({
			id: account.id,
			provider: account.provider,
			providerAccountId: account.providerAccountId,
			type: account.type,
			refreshToken: account.refreshToken,
			accessToken: account.accessToken,
			expiresAt: account.expiresAt,
			tokenType: account.tokenType,
			scope: account.scope,
			tokenId: account.tokenId,
			sessionState: account.sessionState,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				password: user.password,
				avatarUrl: user.avatarUrl,
				birthdate: user.birthdate,
				role: user.role,
				emailVerifiedAt: user.emailVerifiedAt,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
		});
	}
}
