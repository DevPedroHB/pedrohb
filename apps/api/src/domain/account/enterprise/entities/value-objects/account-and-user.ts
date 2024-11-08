import { ValueObject } from "@/core/entities/value-object";
import { Account } from "../account";
import { User } from "../user";

export interface IAccountAndUser {
  account: Account,
  user: User
}

export class AccountAndUser extends ValueObject<IAccountAndUser> {
  get account() {
    return this.props.account;
  }

  get user() {
    return this.props.user;
  }

	static create(props: IAccountAndUser) {
		return new AccountAndUser(props);
	}
}
