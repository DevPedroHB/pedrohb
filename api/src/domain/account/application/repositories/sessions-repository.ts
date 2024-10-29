import { type ISession, Session } from "../../enterprise/entities/session";

export type TSessionFields = Partial<ISession> & {
	id?: string;
};

export abstract class SessionsRepository {
	abstract findByFields(fields: TSessionFields): Promise<Session | null>;
	abstract create(session: Session): Promise<void>;
}
