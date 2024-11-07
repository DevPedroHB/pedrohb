import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AccountWithUser } from "@/domain/account/enterprise/entities/value-objects/account-with-user";
import { Account as PrismaAccount, User as PrismaUser } from "@prisma/client";
import { PrismaUserMapper } from "./prisma-user-mapper";

export type PrismaAccountWithUser = PrismaAccount & {
	user: PrismaUser;
};

export class PrismaAccountWithUserMapper {
	static toDomain(accountWithUser: PrismaAccountWithUser): AccountWithUser {
		return AccountWithUser.create({
			id: new UniqueEntityID(),
			provider: accountWithUser.provider,
			providerAccountId: accountWithUser.providerAccountId,
			type: accountWithUser.type,
			refreshToken: accountWithUser.refreshToken,
			accessToken: accountWithUser.accessToken,
			expiresAt: accountWithUser.expiresAt,
			tokenType: accountWithUser.tokenType,
			scope: accountWithUser.scope,
			tokenId: accountWithUser.tokenId,
			sessionState: accountWithUser.sessionState,
			createdAt: accountWithUser.createdAt,
			updatedAt: accountWithUser.updatedAt,
			user: PrismaUserMapper.toDomain(accountWithUser.user),
		});
	}
}
