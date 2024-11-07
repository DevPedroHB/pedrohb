import { DomainEvents } from "@/core/events/domain-events";
import { matchesFields } from "@/core/functions/matches-fields";
import type { TFetchEntity } from "@/core/types/fetch-entity";
import {
	type TUserFields,
	UsersRepository,
} from "@/domain/account/application/repositories/users-repository";
import { User } from "@/domain/account/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = [];

	async fetchUsers({ fields, orderBy, pagination }: TFetchEntity<TUserFields>) {
		let items = this.items;

		if (fields) {
			items = items.filter((item) => matchesFields(item, fields));
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

		if (pagination) {
			return items.slice(
				(pagination.page - 1) * pagination.perPage,
				pagination.page * pagination.perPage,
			);
		}

		return items;
	}

	async findByFields(fields: TUserFields) {
		return this.items.find((item) => matchesFields(item, fields)) || null;
	}

	async create(user: User) {
		this.items.push(user);

		DomainEvents.dispatchEventsForAggregate(user.id);
	}

	async update(user: User) {
		const index = this.items.findIndex((item) => item.equals(user));

		if (index !== -1) {
			this.items[index] = user;

			DomainEvents.dispatchEventsForAggregate(user.id);
		}
	}

	async delete(user: User) {
		const index = this.items.findIndex((item) => item.equals(user));

		if (index !== -1) {
			this.items.splice(index, 1);

			DomainEvents.dispatchEventsForAggregate(user.id);
		}
	}
}
