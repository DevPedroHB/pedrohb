import { GetUserByIdUseCase } from "@/domain/account/application/use-cases/get-user-by-id";
import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { GetUserByIdController } from "./get-user-by-id.controller";
import { SignUpController } from "./sign-up.controller";

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [SignUpController, GetUserByIdController],
	providers: [SignUpUseCase, GetUserByIdUseCase],
})
export class AccountModule {}
