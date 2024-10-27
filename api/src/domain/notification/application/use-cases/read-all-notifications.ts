import { Either, success } from "@/core/either";
import type { IPagination } from "@/core/types/pagination";
import { Injectable } from "@nestjs/common";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface ReadAllNotificationsUseCaseRequest extends Partial<IPagination> {
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
		page = 1,
		perPage = 10,
	}: ReadAllNotificationsUseCaseRequest): Promise<ReadAllNotificationsUseCaseResponse> {
		const notifications = await this.notificationsRepository.fetchNotifications(
			{
				fields: { recipientId },
				orderBy: { createdAt: "desc" },
				pagination: { page, perPage },
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
