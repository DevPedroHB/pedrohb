import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AccountFactory } from "test/factories/account-factory";

describe("Get user by account (E2E)", () => {
	let app: INestApplication;
	let accountFactory: AccountFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [AccountFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		accountFactory = moduleRef.get(AccountFactory);

		await app.init();
	});

	test("[GET] /accounts/user/:provider/:providerAccountId", async () => {
		const { account } = await accountFactory.makeAccount();

		const response = await request(app.getHttpServer())
			.get(`/accounts/user/${account.provider}/${account.providerAccountId}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			account: expect.objectContaining({
				provider: account.provider,
				providerAccountId: account.providerAccountId,
			}),
		});
	});
});
