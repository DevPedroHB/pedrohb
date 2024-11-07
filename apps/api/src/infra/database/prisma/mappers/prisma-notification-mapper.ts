import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Prisma, Notification as PrismaNotification } from "@prisma/client";

export class PrismaNotificationMapper {
	static toDomain(notification: PrismaNotification): Notification {
		return Notification.create(
			{
				title: notification.title,
				content: JSON.parse(JSON.stringify(notification.content)),
				readAt: notification.readAt,
				createdAt: notification.createdAt,
				recipientId: new UniqueEntityID(notification.recipientId),
			},
			new UniqueEntityID(notification.id),
		);
	}

	static toPrisma(
		notification: Notification,
	): Prisma.NotificationUncheckedCreateInput {
		return {
			id: notification.id.id,
			title: notification.title,
			content: JSON.stringify(notification.content),
			readAt: notification.readAt,
			createdAt: notification.createdAt,
			recipientId: notification.recipientId.id,
		};
	}
}
