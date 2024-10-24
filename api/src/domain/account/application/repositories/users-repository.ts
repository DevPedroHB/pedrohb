import type { IPagination } from "@/core/types/pagination";
import { User, type IUser } from "../../enterprise/entities/user";

export interface IUserFields extends Partial<IUser> {
  id?: string | undefined;
}

export abstract class UsersRepository {
	abstract fetchUsers(params: IPagination): Promise<User[]>;
  abstract findByFields(fields: IUserFields): Promise<User | null>;
	abstract create(user: User): Promise<void>;
	abstract update(user: User): Promise<void>;
	abstract delete(user: User): Promise<void>;
}
