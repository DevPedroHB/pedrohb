import { Module } from "@nestjs/common";
import { AccountModule } from "./controllers/account/account.module";

@Module({
	imports: [AccountModule],
})
export class HttpModule {}
