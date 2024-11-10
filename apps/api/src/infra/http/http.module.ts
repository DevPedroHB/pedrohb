import { Module } from "@nestjs/common";
import { AccountModule } from "./controllers/account/account.module";
import { NotificationModule } from "./controllers/notification/notification.module";

@Module({
	imports: [AccountModule, NotificationModule],
})
export class HttpModule {}
