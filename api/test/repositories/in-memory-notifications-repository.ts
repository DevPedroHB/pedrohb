import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { TFetchEntity } from "@/core/types/fetch-entity";
import {
	NotificationsRepository,
	type TNotificationFields,
} from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class InMemoryNotificationsRepository
	implements NotificationsRepository
{
	public items: Notification[] = [];

	private matchesFields(item: Notification, fields: TNotificationFields) {
		return Object.entries(fields).every(([key, value]) => {
			if (item[key] instanceof UniqueEntityID) {
				return item[key].equals(new UniqueEntityID(String(value)));
			}

			return item[key] === value;
		});
	}

	async fetchNotifications({
		fields,
		orderBy,
		pagination,
	}: TFetchEntity<TNotificationFields>) {
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

	async findByFields(fields: TNotificationFields) {
		return this.items.find((item) => this.matchesFields(item, fields)) || null;
	}

	async create(notification: Notification) {
		this.items.push(notification);
	}

	async update(notification: Notification) {
		const index = this.items.findIndex((item) => item.equals(notification));

		if (index !== -1) {
			this.items[index] = notification;
		}
	}

	async delete(notification: Notification) {
		const index = this.items.findIndex((item) => item.equals(notification));

		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}

	async updateMany(notifications: Notification[]) {
		for (const notification of notifications) {
			this.update(notification);
		}
	}
}
