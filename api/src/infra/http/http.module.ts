import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { Module } from "@nestjs/common";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { SignUpController } from "./controllers/account/sign-up.controller";

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [SignUpController],
	providers: [SignUpUseCase],
})
export class HttpModule {}
