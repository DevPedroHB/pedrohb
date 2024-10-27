import { OnUserCreated } from "@/domain/notification/application/subscribers/on-user-created";
import { CreateNotificationUseCase } from "@/domain/notification/application/use-cases/create-notification";
import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";

@Module({
	imports: [DatabaseModule],
	providers: [OnUserCreated, CreateNotificationUseCase],
})
export class EventsModule {}
