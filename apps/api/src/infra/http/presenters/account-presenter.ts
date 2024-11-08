import { Account } from "@/domain/account/enterprise/entities/account";

export class AccountPresenter {
	static toHTTP(account: Account) {
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
