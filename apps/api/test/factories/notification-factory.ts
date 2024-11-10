import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import {
	type INotification,
	Notification,
} from "@/domain/notification/enterprise/entities/notification";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeNotification(
	override: Partial<INotification> = {},
	id?: UniqueEntityID,
) {
	const content = [
		{
			type: "p",
			children: [
				{
					text: faker.lorem.text(),
				},
			],
		},
	];

	const notification = Notification.create(
		{
			title: faker.lorem.sentence(),
			content: JSON.parse(JSON.stringify(content)),
			recipientId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return notification;
}

@Injectable()
export class NotificationFactory {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async makeNotification(
		data: Partial<INotification> = {},
		id?: UniqueEntityID,
	) {
		const notification = makeNotification(data, id);

		await this.notificationsRepository.create(notification);

		return notification;
	}
}
