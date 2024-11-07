import { Either, success } from "@/core/either";
import type { IPagination } from "@/core/types/pagination";
import { Injectable } from "@nestjs/common";
import { Notification } from "../../enterprise/entities/notification";
import { NotificationsRepository } from "../repositories/notifications-repository";

interface FetchNotificationsUseCaseRequest extends Partial<IPagination> {
	recipientId: string;
}

type FetchNotificationsUseCaseResponse = Either<
	null,
	{
		notifications: Notification[];
	}
>;

@Injectable()
export class FetchNotificationsUseCase {
	constructor(private notificationsRepository: NotificationsRepository) {}

	async execute({
		recipientId,
		page = 1,
		perPage = 10,
	}: FetchNotificationsUseCaseRequest): Promise<FetchNotificationsUseCaseResponse> {
		const notifications = await this.notificationsRepository.fetchNotifications(
			{
				fields: { recipientId },
				orderBy: { createdAt: "desc" },
				pagination: { page, perPage },
			},
		);

		return success({
			notifications,
		});
	}
}
