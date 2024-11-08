import type { TLogicalFilter } from "@/core/types/logical-filter";
import { type ISession, Session } from "../../enterprise/entities/session";
import { SessionAndUser } from "../../enterprise/entities/value-objects/session-and-user";

export type TSessionFields = TLogicalFilter<ISession, "userId"> & {
	userId?: string;
};

export abstract class SessionsRepository {
	abstract findByFields(fields: TSessionFields): Promise<Session | null>;
	abstract create(session: Session): Promise<void>;
	abstract update(session: Session): Promise<void>;
	abstract delete(session: Session): Promise<void>;
	abstract findSessionByToken(
		sessionToken: string,
	): Promise<SessionAndUser | null>;
}
