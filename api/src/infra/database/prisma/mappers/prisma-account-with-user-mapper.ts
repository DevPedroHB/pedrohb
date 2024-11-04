import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AccountWithUser } from "@/domain/account/enterprise/entities/value-objects/account-with-user";
import { Account as PrismaAccount, User as PrismaUser } from "@prisma/client";
import { PrismaUserMapper } from "./prisma-user-mapper";

export type PrismaAccountWithUser = PrismaAccount & {
	user: PrismaUser;
};

export class PrismaAccountWithUserMapper {
	static toDomain(account: PrismaAccountWithUser): AccountWithUser {
		return AccountWithUser.create({
			id: new UniqueEntityID(),
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
			user: PrismaUserMapper.toDomain(account.user),
		});
	}
}
