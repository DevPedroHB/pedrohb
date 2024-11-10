import { Notification } from "@/domain/notification/enterprise/entities/notification";

export class NotificationPresenter {
	static toHTTP(notification: Notification) {
		return {
			id: notification.id.id,
			title: notification.title,
			content: notification.content,
			readAt: notification.readAt,
			createdAt: notification.createdAt,
			recipientId: notification.recipientId.id,
		};
	}
}
