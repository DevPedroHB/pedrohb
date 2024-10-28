import { AccountWithUser } from "../../enterprise/entities/value-objects/account-with-user";

export abstract class AccountsRepository {
	abstract findByProviderId(
		providerAccountId: string,
	): Promise<AccountWithUser | null>;
}
