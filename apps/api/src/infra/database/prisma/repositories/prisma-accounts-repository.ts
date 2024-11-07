import { generateCacheKey } from "@/core/functions/generate-cache-key";
import {
	AccountsRepository,
	type TAccountFields,
} from "@/domain/account/application/repositories/accounts-repository";
import { Account } from "@/domain/account/enterprise/entities/account";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaAccountMapper } from "../mappers/prisma-account-mapper";
import { PrismaAccountWithUserMapper } from "../mappers/prisma-account-with-user-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
	constructor(
		private prisma: PrismaService,
		private cache: CacheRepository,
	) {}

	private async invalidateCache(account: Account) {
		const data = PrismaAccountMapper.toPrisma(account);

		await this.cache.delete("accounts");

		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined && value !== null) {
				await this.cache.delete(`account:${key}:${value}`);
			}
		}
	}

	async findByFields(fields: TAccountFields) {
		const cacheKey = generateCacheKey("account", [fields]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return PrismaAccountMapper.toDomain(JSON.parse(cacheHit));
		}

		const account = await this.prisma.account.findFirst({
			where: fields,
		});

		if (!account) {
			return null;
		}

		await this.cache.set(cacheKey, JSON.stringify(account));

		return PrismaAccountMapper.toDomain(account);
	}

	async create(account: Account) {
		const data = PrismaAccountMapper.toPrisma(account);

		await Promise.all([
			this.prisma.account.create({
				data,
			}),

			this.invalidateCache(account),
		]);
	}

	async delete(account: Account) {
		await Promise.all([
			this.prisma.account.delete({
				where: {
					provider_providerAccountId: {
						provider: account.provider,
						providerAccountId: account.providerAccountId,
					},
				},
			}),

			this.invalidateCache(account),
		]);
	}

	async findByProviderId(provider: string, providerAccountId: string) {
		const cacheKey = generateCacheKey("account", [
			{ provider, providerAccountId },
		]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return PrismaAccountWithUserMapper.toDomain(JSON.parse(cacheHit));
		}

		const accountWithUser = await this.prisma.account.findUnique({
			where: {
				provider_providerAccountId: {
					provider,
					providerAccountId,
				},
			},
			include: {
				user: true,
			},
		});

		if (!accountWithUser) {
			return null;
		}

		await this.cache.set(cacheKey, JSON.stringify(accountWithUser));

		return PrismaAccountWithUserMapper.toDomain(accountWithUser);
	}
}
