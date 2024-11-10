import { FetchNotificationsUseCase } from "@/domain/notification/application/use-cases/fetch-notifications";
import { GetNotificationUseCase } from "@/domain/notification/application/use-cases/get-notification";
import { ReadAllNotificationsUseCase } from "@/domain/notification/application/use-cases/read-all-notifications";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { FetchNotificationsController } from "./fetch-notifications.controller";
import { GetNotificationController } from "./get-notification.controller";
import { ReadAllNotificationsController } from "./read-all-notifications.controller";
import { ReadNotificationController } from "./read-notification.controller";

@Module({
	imports: [DatabaseModule],
	controllers: [
		FetchNotificationsController,
		GetNotificationController,
		ReadAllNotificationsController,
		ReadNotificationController,
	],
	providers: [
		FetchNotificationsUseCase,
		GetNotificationUseCase,
		ReadAllNotificationsUseCase,
		ReadNotificationUseCase,
	],
})
export class NotificationModule {}
