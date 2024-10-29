import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { TFetchEntity } from "@/core/types/fetch-entity";
import {
	AuthenticatorsRepository,
	type TAuthenticatorFields,
} from "@/domain/account/application/repositories/authenticators-repository";
import { Authenticator } from "@/domain/account/enterprise/entities/authenticator";

export class InMemoryAuthenticatorsRepository
	implements AuthenticatorsRepository
{
	public items: Authenticator[] = [];

	private matchesFields(item: Authenticator, fields: TAuthenticatorFields) {
		return Object.entries(fields).every(([key, value]) => {
			if (item[key] instanceof UniqueEntityID) {
				return item[key].equals(new UniqueEntityID(String(value)));
			}

			return item[key] === value;
		});
	}

	async fetchAuthenticators({
		fields,
		orderBy,
		pagination,
	}: TFetchEntity<TAuthenticatorFields>) {
		let items = this.items;

		if (fields) {
			items = items.filter((item) => this.matchesFields(item, fields));
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

	async findByFields(fields: TAuthenticatorFields) {
		return this.items.find((item) => this.matchesFields(item, fields)) || null;
	}

	async create(authenticator: Authenticator) {
		this.items.push(authenticator);
	}

	async update(authenticator: Authenticator) {
		const index = this.items.findIndex((item) => item.equals(authenticator));

		if (index !== -1) {
			this.items[index] = authenticator;
		}
	}
}
