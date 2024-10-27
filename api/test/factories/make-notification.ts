import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	type INotification,
	Notification,
} from "@/domain/notification/enterprise/entities/notification";
import { faker } from "@faker-js/faker";
import { makeUser } from "./make-user";

export function makeNotification(
	override: Partial<INotification> = {},
	id?: UniqueEntityID,
) {
	const user = makeUser();

	const notification = Notification.create(
		{
			title: faker.lorem.sentence(),
			content: faker.lorem.text(),
			recipientId: user.id,
			createdAt: faker.date.past({ refDate: user.createdAt }),
			...override,
		},
		id,
	);

	return {
		user,
		notification,
	};
}
