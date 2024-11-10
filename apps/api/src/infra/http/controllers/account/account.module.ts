import { CreateAccountUseCase } from "@/domain/account/application/use-cases/create-account";
import { CreateAuthenticatorUseCase } from "@/domain/account/application/use-cases/create-authenticator";
import { CreateSessionUseCase } from "@/domain/account/application/use-cases/create-session";
import { CreateVerificationTokenUseCase } from "@/domain/account/application/use-cases/create-verification-token";
import { DeleteAccountUseCase } from "@/domain/account/application/use-cases/delete-account";
import { DeleteSessionUseCase } from "@/domain/account/application/use-cases/delete-session";
import { DeleteUserUseCase } from "@/domain/account/application/use-cases/delete-user";
import { FetchUserAuthenticatorsUseCase } from "@/domain/account/application/use-cases/fetch-user-authenticators";
import { GetAccountUseCase } from "@/domain/account/application/use-cases/get-account";
import { GetAuthenticatorUseCase } from "@/domain/account/application/use-cases/get-authenticator";
import { GetSessionUseCase } from "@/domain/account/application/use-cases/get-session";
import { GetUserByAccountUseCase } from "@/domain/account/application/use-cases/get-user-by-account";
import { GetUserByEmailUseCase } from "@/domain/account/application/use-cases/get-user-by-email";
import { GetUserByIdUseCase } from "@/domain/account/application/use-cases/get-user-by-id";
import { SignUpUseCase } from "@/domain/account/application/use-cases/sign-up";
import { UpdateAuthenticatorCounterUseCase } from "@/domain/account/application/use-cases/update-authenticator-counter";
import { UpdateSessionUseCase } from "@/domain/account/application/use-cases/update-session";
import { UpdateUserUseCase } from "@/domain/account/application/use-cases/update-user";
import { UseVerificationTokenUseCase } from "@/domain/account/application/use-cases/use-verification-token";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { Module } from "@nestjs/common";
import { CreateAccountController } from "./create-account.controller";
import { CreateAuthenticatorController } from "./create-authenticator.controller";
import { CreateSessionController } from "./create-session.controller";
import { CreateVerificationTokenController } from "./create-verification-token.controller";
import { DeleteAccountController } from "./delete-account.controller";
import { DeleteSessionController } from "./delete-session.controller";
import { DeleteUserController } from "./delete-user.controller";
import { FetchUserAuthenticatorsController } from "./fetch-user-authenticators.controller";
import { GetAccountController } from "./get-account.controller";
import { GetAuthenticatorController } from "./get-authenticator.controller";
import { GetSessionController } from "./get-session.controller";
import { GetUserByAccountController } from "./get-user-by-account.controller";
import { GetUserByEmailController } from "./get-user-by-email.controller";
import { GetUserByIdController } from "./get-user-by-id.controller";
import { SignUpController } from "./sign-up.controller";
import { UpdateAuthenticatorCounterController } from "./update-authenticator-counter.controller";
import { UpdateSessionController } from "./update-session.controller";
import { UpdateUserController } from "./update-user.controller";
import { UseVerificationTokenController } from "./use-verification-token.controller";

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
		GetAccountController,
		// Session
		CreateSessionController,
		GetSessionController,
		UpdateSessionController,
		DeleteSessionController,
		// Verification token
		CreateVerificationTokenController,
		UseVerificationTokenController,
		// Authenticator
		GetAuthenticatorController,
		CreateAuthenticatorController,
		FetchUserAuthenticatorsController,
		UpdateAuthenticatorCounterController,
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
		GetAccountUseCase,
		// Session
		CreateSessionUseCase,
		GetSessionUseCase,
		UpdateSessionUseCase,
		DeleteSessionUseCase,
		// Verification token
		CreateVerificationTokenUseCase,
		UseVerificationTokenUseCase,
		// Authenticator
		GetAuthenticatorUseCase,
		CreateAuthenticatorUseCase,
		FetchUserAuthenticatorsUseCase,
		UpdateAuthenticatorCounterUseCase,
	],
})
export class AccountModule {}
