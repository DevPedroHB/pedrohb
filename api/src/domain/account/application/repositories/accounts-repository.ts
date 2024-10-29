import { Account, type IAccount } from "../../enterprise/entities/account";
import { AccountWithUser } from "../../enterprise/entities/value-objects/account-with-user";

export type TAccountFields = Omit<Partial<IAccount>, "userId"> & {
	id?: string;
	userId?: string;
};

export abstract class AccountsRepository {
	abstract findByFields(fields: TAccountFields): Promise<Account | null>;
	abstract create(account: Account): Promise<void>;
	abstract findByProviderId(
		provider: string,
		providerAccountId: string,
	): Promise<AccountWithUser | null>;
	abstract delete(account: Account): Promise<void>;
}
