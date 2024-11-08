import type { TEntityFields } from "@/core/types/entity-fields";
import { Account, type IAccount } from "../../enterprise/entities/account";
import { AccountAndUser } from "../../enterprise/entities/value-objects/account-and-user";

export type TAccountFields = TEntityFields<IAccount, "userId"> & {
	userId?: string;
};

export abstract class AccountsRepository {
	abstract findByFields(fields: TAccountFields): Promise<Account | null>;
	abstract create(account: Account): Promise<void>;
	abstract delete(account: Account): Promise<void>;
	abstract findByProviderId(
		provider: string,
		providerAccountId: string,
	): Promise<AccountAndUser | null>;
}
