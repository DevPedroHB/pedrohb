import { Either, success } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface ReadAllNotificationsUseCaseRequest {
	recipientId: string;
}

type ReadAllNotificationsUseCaseResponse = Either<
	null,
	{
		notifications: Notification[];
	}
>;

@Injectable()
export class ReadAllNotificationsUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		recipientId,
	}: ReadAllNotificationsUseCaseRequest): Promise<ReadAllNotificationsUseCaseResponse> {
		const notifications = await this.notificationsRepository.fetchNotifications(
			{
				fields: {
					readAt: null,
					recipientId,
				},
				orderBy: { createdAt: "desc" },
			},
		);

		for (const notification of notifications) {
			notification.read();
		}

		await this.notificationsRepository.updateMany(notifications);

		return success({
			notifications,
		});
	}
}
