import { GetUserByAccountUseCase } from "@/domain/account/application/use-cases/get-user-by-account";
import { GetUserByEmailUseCase } from "@/domain/account/application/use-cases/get-user-by-email";
import { GetUserByIdUseCase } from "@/domain/account/application/use-cases/get-user-by-id";
import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { GetUserByAccountController } from "./get-user-by-account.controller";
import { GetUserByEmailController } from "./get-user-by-email.controller";
import { GetUserByIdController } from "./get-user-by-id.controller";
import { SignUpController } from "./sign-up.controller";

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		// User
		SignUpController,
		GetUserByIdController,
		GetUserByEmailController,
		// Account
		GetUserByAccountController,
	],
	providers: [
		SignUpUseCase,
		GetUserByIdUseCase,
		GetUserByEmailUseCase,
		// Account
		GetUserByAccountUseCase,
	],
})
export class AccountModule {}
