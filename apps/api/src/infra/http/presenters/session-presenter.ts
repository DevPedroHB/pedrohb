import { Session } from "@/domain/account/enterprise/entities/session";

export class SessionPresenter {
	static toHTTP(session: Session) {
		return {
			sessionToken: session.sessionToken,
			expiresAt: session.expiresAt,
			createdAt: session.createdAt,
			updatedAt: session.updatedAt,
			userId: session.userId.id,
		};
	}
}
