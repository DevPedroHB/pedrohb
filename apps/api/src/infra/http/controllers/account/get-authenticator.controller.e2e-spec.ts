import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AuthenticatorFactory } from "test/factories/authenticator-factory";
import { UserFactory } from "test/factories/user-factory";

describe("Get authenticator (E2E)", () => {
	let app: INestApplication;
	let userFactory: UserFactory;
	let authenticatorFactory: AuthenticatorFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory, AuthenticatorFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		userFactory = moduleRef.get(UserFactory);
		authenticatorFactory = moduleRef.get(AuthenticatorFactory);

		await app.init();
	});

	test("[GET] /authenticators/credential-id/:credentialId", async () => {
		const user = await userFactory.makeUser();
		const authenticator = await authenticatorFactory.makeAuthenticator({
			userId: user.id,
		});

		const response = await request(app.getHttpServer())
			.get(`/authenticators/credential-id/${authenticator.credentialId}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			authenticator: expect.objectContaining({
				credentialId: authenticator.credentialId,
				userId: authenticator.userId.id,
			}),
		});
	});
});
