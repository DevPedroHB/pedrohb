import type { TEntityFields } from "@/core/types/entity-fields";
import type { TOrderBy } from "@/core/types/order-by";
import type { IPagination } from "@/core/types/pagination";
import { type IUser, User } from "../../enterprise/entities/user";

export abstract class UsersRepository {
	abstract fetchUsers(
		pagination: IPagination,
		orderBy?: TOrderBy<IUser>,
		fields?: TEntityFields<IUser>,
	): Promise<User[]>;
	abstract findByFields(fields: TEntityFields<IUser>): Promise<User | null>;
	abstract create(user: User): Promise<void>;
	abstract update(user: User): Promise<void>;
	abstract delete(user: User): Promise<void>;
}
