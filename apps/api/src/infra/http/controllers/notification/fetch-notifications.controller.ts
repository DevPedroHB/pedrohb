import { FetchNotificationsUseCase } from "@/domain/notification/application/use-cases/fetch-notifications";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { UserPayloadSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaginationQueryDto } from "../../dtos/pagination.dto";
import { ErrorHandler } from "../../error-handler";
import { NotificationPresenter } from "../../presenters/notification-presenter";

@ApiTags("notifications")
@Controller({ path: "/notifications", version: "v1" })
export class FetchNotificationsController {
	constructor(private fetchNotifications: FetchNotificationsUseCase) {}

	@Get()
	async handle(
		@CurrentUser() { sub }: UserPayloadSchema,
		@Query() { page, perPage }: PaginationQueryDto,
	) {
		const result = await this.fetchNotifications.execute({
			recipientId: sub,
			page,
			perPage,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			notifications: result.value.notifications.map(
				NotificationPresenter.toHTTP,
			),
		};
	}
}
