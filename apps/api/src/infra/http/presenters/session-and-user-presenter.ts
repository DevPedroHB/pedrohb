import { SessionAndUser } from "@/domain/account/enterprise/entities/value-objects/session-and-user";
import { SessionPresenter } from "./session-presenter";
import { UserPresenter } from "./user-presenter";

export class SessionAndUserPresenter {
	static toHTTP(sessionAndUser: SessionAndUser) {
		const { userId, ...session } = SessionPresenter.toHTTP(
			sessionAndUser.session,
		);
		const user = UserPresenter.toHTTP(sessionAndUser.user);

		return {
			...session,
			user,
		};
	}
}
