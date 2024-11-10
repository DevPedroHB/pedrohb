import { GetNotificationUseCase } from "@/domain/notification/application/use-cases/get-notification";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { UserPayloadSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetNotificationParamDto } from "../../dtos/notification/get-notification.dto";
import { ErrorHandler } from "../../error-handler";
import { NotificationPresenter } from "../../presenters/notification-presenter";

@ApiTags("notifications")
@Controller({ path: "/notifications/:notificationId", version: "v1" })
export class GetNotificationController {
	constructor(private getNotification: GetNotificationUseCase) {}

	@Get()
	async handle(
		@CurrentUser() { sub }: UserPayloadSchema,
		@Param() { notificationId }: GetNotificationParamDto,
	) {
		const result = await this.getNotification.execute({
			notificationId,
			recipientId: sub,
		});

		if (result.isError()) {
			ErrorHandler.handle(result.value);
		}

		return {
			notification: NotificationPresenter.toHTTP(result.value.notification),
		};
	}
}
