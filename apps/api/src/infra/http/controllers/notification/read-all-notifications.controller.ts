import { ReadAllNotificationsUseCase } from "@/domain/notification/application/use-cases/read-all-notifications";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import type { UserPayloadSchema } from "@/infra/auth/jwt.strategy";
import { Controller, Patch } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ErrorHandler } from "../../error-handler";
import { NotificationPresenter } from "../../presenters/notification-presenter";

@ApiTags("Notifications")
@Controller({ path: "/notifications", version: "v1" })
export class ReadAllNotificationsController {
	constructor(private readAllNotifications: ReadAllNotificationsUseCase) {}

	@ApiOperation({
		summary:
			"Deve ser possível marcar todas as notificação de um usuário como lida",
	})
	@Patch()
	async handle(@CurrentUser() { sub }: UserPayloadSchema) {
		const result = await this.readAllNotifications.execute({
			recipientId: sub,
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
