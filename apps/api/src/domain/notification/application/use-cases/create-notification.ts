import { Either, error, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error";
import { Injectable } from "@nestjs/common";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface CreateNotificationUseCaseRequest {
	title: string;
	content: string;
	recipientId: string;
}

type CreateNotificationUseCaseResponse = Either<
	InvalidCredentialsError,
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
		let parsedContent: any;

		try {
			parsedContent = JSON.parse(content);
		} catch {
			return error(new InvalidCredentialsError());
		}

		const notification = Notification.create({
			title,
			content: parsedContent,
			recipientId: new UniqueEntityID(recipientId),
		});

		await this.notificationsRepository.create(notification);

		return success({
			notification,
		});
	}
}
