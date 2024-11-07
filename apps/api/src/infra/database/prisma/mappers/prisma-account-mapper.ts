import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Account } from "@/domain/account/enterprise/entities/account";
import { Prisma, Account as PrismaAccount } from "@prisma/client";

export class PrismaAccountMapper {
	static toDomain(account: PrismaAccount): Account {
		return Account.create({
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
			userId: new UniqueEntityID(account.userId),
		});
	}

	static toPrisma(account: Account): Prisma.AccountUncheckedCreateInput {
		return {
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
			userId: account.userId.id,
		};
	}
}
