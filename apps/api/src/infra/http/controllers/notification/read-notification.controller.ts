import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { UserPayloadSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ReadNotificationParamDto } from "../../dtos/notification/read-notification.dto";
import { ErrorHandler } from "../../error-handler";
import { NotificationPresenter } from "../../presenters/notification-presenter";

@ApiTags("notifications")
@Controller({ path: "/notifications/:notificationId", version: "v1" })
export class ReadNotificationController {
	constructor(private readNotification: ReadNotificationUseCase) {}

	@Patch()
	async handle(
		@CurrentUser() { sub }: UserPayloadSchema,
		@Param() { notificationId }: ReadNotificationParamDto,
	) {
		const result = await this.readNotification.execute({
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
