import type { TPartialFactory } from "@/core/types/partial-factory";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import type { IUser } from "@/domain/account/enterprise/entities/user";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import {
	type INotification,
	Notification,
} from "@/domain/notification/enterprise/entities/notification";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { makeUser } from "./user-factory";

interface INotificationFactory {
	user?: TPartialFactory<IUser>;
	notification?: TPartialFactory<INotification>;
}

export function makeNotification(
	override: INotificationFactory = { user: {}, notification: {} },
) {
	const user = makeUser(override.user);
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
			createdAt: faker.date.past({ refDate: user.createdAt }),
			recipientId: user.id,
			...override.notification,
		},
		override.notification.id,
	);

	return {
		user,
		notification,
	};
}

@Injectable()
export class NotificationFactory {
	constructor(
		private usersRepository: UsersRepository,
		private notificationsRepository: NotificationsRepository,
	) {}

	async makeNotification(
		data: INotificationFactory = { user: {}, notification: {} },
	) {
		const { user, notification } = makeNotification(data);

		await this.usersRepository.create(user);
		await this.notificationsRepository.create(notification);

		return {
			user,
			notification,
		};
	}
}
