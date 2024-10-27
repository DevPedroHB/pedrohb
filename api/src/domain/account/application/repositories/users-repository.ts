import type { TFetchEntity } from "@/core/types/fetch-entity";
import { type IUser, User } from "../../enterprise/entities/user";

export type TUserFields = Partial<IUser> & {
	id?: string;
};

export abstract class UsersRepository {
	abstract fetchUsers(options: TFetchEntity<TUserFields>): Promise<User[]>;
	abstract findByFields(fields: TUserFields): Promise<User | null>;
	abstract create(user: User): Promise<void>;
	abstract update(user: User): Promise<void>;
	abstract delete(user: User): Promise<void>;
}
