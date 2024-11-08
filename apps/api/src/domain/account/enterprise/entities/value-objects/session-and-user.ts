import { ValueObject } from "@/core/entities/value-object";
import { Session } from "../session";
import { User } from "../user";

export interface ISessionAndUser {
	session: Session;
	user: User;
}

export class SessionAndUser extends ValueObject<ISessionAndUser> {
	get session() {
		return this.props.session;
	}

	get user() {
		return this.props.user;
	}

	static create(props: ISessionAndUser) {
		return new SessionAndUser(props);
	}
}
