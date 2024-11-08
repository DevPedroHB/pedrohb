import { AccountWithUser } from "@/domain/account/enterprise/entities/value-objects/account-with-user";

export class AccountWithUserPresenter {
	static toHTTP(accountWithUser: AccountWithUser) {
		return {
			id: accountWithUser.id.id,
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
			user: {
				id: accountWithUser.user.id.id,
				name: accountWithUser.user.name,
				email: accountWithUser.user.email,
				avatarUrl: accountWithUser.user.avatarUrl,
				birthdate: accountWithUser.user.birthdate,
				role: accountWithUser.user.role,
				emailVerifiedAt: accountWithUser.user.emailVerifiedAt,
				createdAt: accountWithUser.user.createdAt,
				updatedAt: accountWithUser.user.updatedAt,
			},
		};
	}
}
