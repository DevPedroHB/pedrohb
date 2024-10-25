import type { TEntityFields } from "@/core/types/entity-fields";
import type { TOrderBy } from "@/core/types/order-by";
import type { IPagination } from "@/core/types/pagination";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { type IUser, User } from "@/domain/account/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = [];

	async fetchUsers(
		pagination: IPagination,
		orderBy?: TOrderBy<IUser>,
		fields?: TEntityFields<IUser>,
	) {
		let items = this.items;

		if (fields) {
			items = items.filter((item) => {
				return Object.entries(fields).every(([key, value]) => {
					return item[key] === value;
				});
			});
		}

		if (orderBy) {
			items = items.sort((a, b) => {
				return Object.entries(orderBy).reduce((acc, [key, direction]) => {
					if (acc !== 0) return acc;

					const aValue = a[key];
					const bValue = b[key];

					if (aValue < bValue) return direction === "asc" ? -1 : 1;
					if (aValue > bValue) return direction === "asc" ? 1 : -1;

					return 0;
				}, 0);
			});
		}

		return items.slice(
			(pagination.page - 1) * pagination.perPage,
			pagination.page * pagination.perPage,
		);
	}

	async findByFields(fields: TEntityFields<IUser>) {
		return (
			this.items.find((item) => {
				return Object.entries(fields).every(([key, value]) => {
					return item[key] === value;
				});
			}) || null
		);
	}

	async create(user: User) {
		this.items.push(user);
	}

	async update(user: User) {
		const index = this.items.findIndex((item) => item.id.id === user.id.id);

		this.items[index] = user;
	}

	async delete(user: User) {
		const index = this.items.findIndex((item) => item.id.id === user.id.id);

		this.items.splice(index, 1);
	}
}
