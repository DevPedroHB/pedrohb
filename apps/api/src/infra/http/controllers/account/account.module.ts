import { CreateAccountUseCase } from "@/domain/account/application/use-cases/create-account";
import { DeleteAccountUseCase } from "@/domain/account/application/use-cases/delete-account";
import { DeleteUserUseCase } from "@/domain/account/application/use-cases/delete-user";
import { GetUserByAccountUseCase } from "@/domain/account/application/use-cases/get-user-by-account";
import { GetUserByEmailUseCase } from "@/domain/account/application/use-cases/get-user-by-email";
import { GetUserByIdUseCase } from "@/domain/account/application/use-cases/get-user-by-id";
import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { UpdateUserUseCase } from "@/domain/account/application/use-cases/update-user";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { CreateAccountController } from "./create-account.controller";
import { DeleteAccountController } from "./delete-account.controller";
import { DeleteUserController } from "./delete-user.controller";
import { GetUserByAccountController } from "./get-user-by-account.controller";
import { GetUserByEmailController } from "./get-user-by-email.controller";
import { GetUserByIdController } from "./get-user-by-id.controller";
import { SignUpController } from "./sign-up.controller";
import { UpdateUserController } from "./update-user.controller";

@Module({
	imports: [DatabaseModule, CryptographyModule],
	controllers: [
		// User
		SignUpController,
		GetUserByIdController,
		GetUserByEmailController,
		UpdateUserController,
		DeleteUserController,
		// Account
		GetUserByAccountController,
		CreateAccountController,
		DeleteAccountController,
	],
	providers: [
		SignUpUseCase,
		GetUserByIdUseCase,
		GetUserByEmailUseCase,
		UpdateUserUseCase,
		DeleteUserUseCase,
		// Account
		GetUserByAccountUseCase,
		CreateAccountUseCase,
		DeleteAccountUseCase,
	],
})
export class AccountModule {}
