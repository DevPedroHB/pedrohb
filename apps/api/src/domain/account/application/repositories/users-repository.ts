import type { TLogicalFilter } from "@/core/types/logical-filter";
import type { TQueryOptions } from "@/core/types/query-options";
import { type IUser, User } from "../../enterprise/entities/user";

export type TUserFields = TLogicalFilter<IUser>;

export abstract class UsersRepository {
	abstract fetchUsers(options: TQueryOptions<TUserFields>): Promise<User[]>;
	abstract findByFields(fields: TUserFields): Promise<User | null>;
	abstract create(user: User): Promise<void>;
	abstract update(user: User): Promise<void>;
	abstract delete(user: User): Promise<void>;
}
