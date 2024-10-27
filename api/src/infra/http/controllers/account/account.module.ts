import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { SignUpController } from "./sign-up.controller";

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [SignUpController],
	providers: [SignUpUseCase],
})
export class AccountModule {}
