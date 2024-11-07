import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import { type IAccount } from "../account";
import { type IUser } from "../user";

export interface IAccountWithUser extends Omit<IAccount, "userId"> {
	id: UniqueEntityID;
	user: IUser & {
		id: UniqueEntityID;
	};
}

export class AccountWithUser extends ValueObject<IAccountWithUser> {
	get id() {
		return this.props.id;
	}

	get provider() {
		return this.props.provider;
	}

	get providerAccountId() {
		return this.props.providerAccountId;
	}

	get type() {
		return this.props.type;
	}

	get refreshToken() {
		return this.props.refreshToken;
	}

	get accessToken() {
		return this.props.accessToken;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	get tokenType() {
		return this.props.tokenType;
	}

	get scope() {
		return this.props.scope;
	}

	get tokenId() {
		return this.props.tokenId;
	}

	get sessionState() {
		return this.props.sessionState;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get user() {
		return this.props.user;
	}

	static create(props: IAccountWithUser) {
		return new AccountWithUser(props);
	}
}
