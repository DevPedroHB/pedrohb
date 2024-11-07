import { AccountsRepository } from "@/domain/account/application/repositories/accounts-repository";
import { AuthenticatorsRepository } from "@/domain/account/application/repositories/authenticators-repository";
import { SessionsRepository } from "@/domain/account/application/repositories/sessions-repository";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { VerificationTokensRepository } from "@/domain/account/application/repositories/verification-tokens-repository";
import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Module } from "@nestjs/common";
import { CacheModule } from "../cache/cache.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaAccountsRepository } from "./prisma/repositories/prisma-accounts-repository";
import { PrismaAuthenticatorsRepository } from "./prisma/repositories/prisma-authenticators-repository";
import { PrismaNotificationsRepository } from "./prisma/repositories/prisma-notifications-repository";
import { PrismaSessionsRepository } from "./prisma/repositories/prisma-sessions-repository";
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository";
import { PrismaVerificationTokensRepository } from "./prisma/repositories/prisma-verification-tokens-repository";

@Module({
	imports: [CacheModule],
	providers: [
		PrismaService,
		{
			provide: AccountsRepository,
			useClass: PrismaAccountsRepository,
		},
		{
			provide: AuthenticatorsRepository,
			useClass: PrismaAuthenticatorsRepository,
		},
		{
			provide: SessionsRepository,
			useClass: PrismaSessionsRepository,
		},
		{
			provide: UsersRepository,
			useClass: PrismaUsersRepository,
		},
		{
			provide: VerificationTokensRepository,
			useClass: PrismaVerificationTokensRepository,
		},
		{
			provide: NotificationsRepository,
			useClass: PrismaNotificationsRepository,
		},
	],
	exports: [
		PrismaService,
		AccountsRepository,
		AuthenticatorsRepository,
		SessionsRepository,
		UsersRepository,
		VerificationTokensRepository,
		NotificationsRepository,
	],
})
export class DatabaseModule {}
