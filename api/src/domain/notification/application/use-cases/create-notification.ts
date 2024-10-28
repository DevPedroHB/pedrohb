import { Either, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface CreateNotificationUseCaseRequest {
	title: string;
	content: string;
	recipientId: string;
}

type CreateNotificationUseCaseResponse = Either<
	null,
	{
		notification: Notification;
	}
>;

@Injectable()
export class CreateNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		title,
		content,
		recipientId,
	}: CreateNotificationUseCaseRequest): Promise<CreateNotificationUseCaseResponse> {
		const notification = Notification.create({
			title,
			content,
			recipientId: new UniqueEntityID(recipientId),
		});

		await this.notificationsRepository.create(notification);

		return success({
			notification,
		});
	}
}