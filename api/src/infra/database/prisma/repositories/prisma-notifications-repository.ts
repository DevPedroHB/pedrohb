import { generateCacheKey } from "@/core/functions/generate-cache-key";
import type { TFetchEntity } from "@/core/types/fetch-entity";
import {
	NotificationsRepository,
	type TNotificationFields,
} from "@/domain/notification/application/repositories/notifications-repository";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
	constructor(
		private prisma: PrismaService,
		private cache: CacheRepository,
	) {}

	private async invalidateCache(notification: Notification) {
		const data = PrismaNotificationMapper.toPrisma(notification);

		await this.cache.delete("notifications");

		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined && value !== null) {
				await this.cache.delete(`notification:${key}:${value}`);
			}
		}
	}

	async fetchNotifications({
		fields,
		orderBy,
		pagination,
	}: TFetchEntity<TNotificationFields>) {
		const cacheKey = generateCacheKey("notifications", [
			fields,
			orderBy,
			pagination,
		]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return JSON.parse(cacheHit).map(PrismaNotificationMapper.toDomain);
		}

		const orderArray = orderBy
			? Object.entries(orderBy).map(([field, direction]) => ({
					[field]: direction,
				}))
			: undefined;

		const notifications = await this.prisma.notification.findMany({
			where: fields
				? {
						...fields,
						content: fields.content ? JSON.parse(fields.content) : undefined,
					}
				: undefined,
			orderBy: orderArray,
			take: pagination?.perPage,
			skip: pagination ? (pagination.page - 1) * pagination.perPage : undefined,
		});

		await this.cache.set(cacheKey, JSON.stringify(notifications));

		return notifications.map(PrismaNotificationMapper.toDomain);
	}

	async findByFields(fields: TNotificationFields) {
		const cacheKey = generateCacheKey("notification", [fields]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return PrismaNotificationMapper.toDomain(JSON.parse(cacheHit));
		}

		const notification = await this.prisma.notification.findFirst({
			where: {
				...fields,
				content: fields.content ? JSON.parse(fields.content) : undefined,
			},
		});

		if (!notification) {
			return null;
		}

		await this.cache.set(cacheKey, JSON.stringify(notification));

		return PrismaNotificationMapper.toDomain(notification);
	}

	async create(notification: Notification) {
		const data = PrismaNotificationMapper.toPrisma(notification);

		await Promise.all([
			this.prisma.notification.create({
				data,
			}),

			this.invalidateCache(notification),
		]);
	}

	async update(notification: Notification) {
		const data = PrismaNotificationMapper.toPrisma(notification);

		await Promise.all([
			this.prisma.notification.update({
				where: {
					id: data.id,
				},
				data,
			}),

			this.invalidateCache(notification),
		]);
	}

	async delete(notification: Notification) {
		await Promise.all([
			this.prisma.notification.delete({
				where: {
					id: notification.id.id,
				},
			}),

			this.invalidateCache(notification),
		]);
	}

	async updateMany(notifications: Notification[]) {
		for (const notification of notifications) {
			await this.update(notification);
		}
	}
}
