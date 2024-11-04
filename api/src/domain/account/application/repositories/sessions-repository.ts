import type { TEntityFields } from "@/core/types/entity-fields";
import { type ISession, Session } from "../../enterprise/entities/session";
import { SessionWithUser } from "../../enterprise/entities/value-objects/session-with-user";

export type TSessionFields = TEntityFields<ISession, "userId"> & {
	userId?: string;
};

export abstract class SessionsRepository {
	abstract findByFields(fields: TSessionFields): Promise<Session | null>;
	abstract create(session: Session): Promise<void>;
	abstract update(session: Session): Promise<void>;
	abstract delete(session: Session): Promise<void>;
	abstract findSessionByToken(
		sessionToken: string,
	): Promise<SessionWithUser | null>;
}
