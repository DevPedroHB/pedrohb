import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object";
import type { ISession } from "../session";
import type { IUser } from "../user";

export interface ISessionWithUser extends Omit<ISession, "userId"> {
	id: UniqueEntityID;
	user: IUser & {
		id: UniqueEntityID;
	};
}

export class SessionWithUser extends ValueObject<ISessionWithUser> {
	get sessionToken() {
		return this.props.sessionToken;
	}

	get expiresAt() {
		return this.props.expiresAt;
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

	static create(props: ISessionWithUser) {
		return new SessionWithUser(props);
	}
}
