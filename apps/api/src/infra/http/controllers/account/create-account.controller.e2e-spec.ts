import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeAccount } from "test/factories/account-factory";
import { UserFactory } from "test/factories/user-factory";

describe("Create account (E2E)", () => {
	let app: INestApplication;
	let userFactory: UserFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		userFactory = moduleRef.get(UserFactory);

		await app.init();
	});

	test("[POST] /accounts/user/:userId", async () => {
		const user = await userFactory.makeUser();
		const account = makeAccount({ userId: user.id });

		const response = await request(app.getHttpServer())
			.post(`/accounts/user/${account.userId.id}`)
			.send({
				provider: account.provider,
				providerAccountId: account.providerAccountId,
				type: account.type,
				refreshToken: account.refreshToken,
				accessToken: account.accessToken,
				expiresAt: account.expiresAt,
				tokenType: account.tokenType,
				scope: account.scope,
				tokenId: account.tokenId,
			});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			account: expect.objectContaining({
				provider: account.provider,
				providerAccountId: account.providerAccountId,
				type: account.type,
			}),
		});
	});
});
