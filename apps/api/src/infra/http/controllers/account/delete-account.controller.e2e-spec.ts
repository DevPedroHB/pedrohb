import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AccountFactory } from "test/factories/account-factory";
import { UserFactory } from "test/factories/user-factory";

describe("Delete account (E2E)", () => {
	let app: INestApplication;
	let userFactory: UserFactory;
	let accountFactory: AccountFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory, AccountFactory],
		}).compile();

		app = moduleRef.createNestApplication();

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

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			account: expect.objectContaining({
				provider: account.provider,
				providerAccountId: account.providerAccountId,
			}),
		});
	});
});
