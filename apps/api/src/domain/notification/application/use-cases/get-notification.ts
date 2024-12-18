import { Either, error, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface GetNotificationUseCaseRequest {
	notificationId: string;
	recipientId: string;
}

type GetNotificationUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		notification: Notification;
	}
>;

@Injectable()
export class GetNotificationUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		notificationId,
		recipientId,
	}: GetNotificationUseCaseRequest): Promise<GetNotificationUseCaseResponse> {
		const notification = await this.notificationsRepository.findByFields({
			id: notificationId,
		});

		if (!notification) {
			return error(new ResourceNotFoundError("Notificação"));
		}

		if (!notification.recipientId.equals(new UniqueEntityID(recipientId))) {
			return error(new NotAllowedError());
		}

		return success({
			notification,
		});
	}
}
