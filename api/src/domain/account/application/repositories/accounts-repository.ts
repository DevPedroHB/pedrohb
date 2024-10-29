import { Account } from "../../enterprise/entities/account";
import { AccountWithUser } from "../../enterprise/entities/value-objects/account-with-user";

export abstract class AccountsRepository {
	abstract create(account: Account): Promise<void>;
	abstract findByProviderId(
		providerAccountId: string,
	): Promise<AccountWithUser | null>;
}
