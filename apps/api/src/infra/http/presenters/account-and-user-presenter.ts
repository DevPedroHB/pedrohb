import type { AccountAndUser } from "@/domain/account/enterprise/entities/value-objects/account-and-user";
import { AccountPresenter } from "./account-presenter";
import { UserPresenter } from "./user-presenter";

export class AccountAndUserPresenter {
	static toHTTP(accountAndUser: AccountAndUser) {
		const { userId, ...account } = AccountPresenter.toHTTP(
			accountAndUser.account,
		);
		const user = UserPresenter.toHTTP(accountAndUser.user);

		return {
			...account,
			user,
		};
	}
}
