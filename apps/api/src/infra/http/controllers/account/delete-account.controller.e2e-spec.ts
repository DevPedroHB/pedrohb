import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AccountFactory } from "test/factories/account-factory";
import { UserFactory } from "test/factories/user-factory";

describe("Delete account (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let userFactory: UserFactory;
	let accountFactory: AccountFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory, AccountFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		userFactory = moduleRef.get(UserFactory);
		accountFactory = moduleRef.get(AccountFactory);

		await app.init();
	});

	test("[DELETE] /accounts/:provider/:providerAccountId", async () => {
		const user = await userFactory.makeUser();
		const account = await accountFactory.makeAccount({ userId: user.id });

		const response = await request(app.getHttpServer())
			.delete(`/accounts/${account.provider}/${account.providerAccountId}`)
			.send();

		const accountOnDatabase = await prisma.account.findUnique({
			where: {
				provider_providerAccountId: {
					provider: account.provider,
					providerAccountId: account.providerAccountId,
				},
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			account: expect.objectContaining({
				provider: account.provider,
				providerAccountId: account.providerAccountId,
				userId: account.userId.id,
			}),
		});
		expect(accountOnDatabase).toBeNull();
	});
});
