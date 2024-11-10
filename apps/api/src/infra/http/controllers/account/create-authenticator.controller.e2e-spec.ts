import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeAuthenticator } from "test/factories/authenticator-factory";
import { UserFactory } from "test/factories/user-factory";

describe("Create authenticator (E2E)", () => {
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

	test("[POST] /authenticators/:userId", async () => {
		const user = await userFactory.makeUser();
		const authenticator = makeAuthenticator({ userId: user.id });

		const response = await request(app.getHttpServer())
			.post(`/authenticators/${authenticator.userId.id}`)
			.send({
				credentialId: authenticator.credentialId,
				providerAccountId: authenticator.providerAccountId,
				credentialPublicKey: authenticator.credentialPublicKey,
				counter: authenticator.counter,
				credentialDeviceType: authenticator.credentialDeviceType,
				credentialBackedUp: authenticator.credentialBackedUp,
				transports: authenticator.transports,
			});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			authenticator: expect.objectContaining({
				credentialId: authenticator.credentialId,
				providerAccountId: authenticator.providerAccountId,
				credentialPublicKey: authenticator.credentialPublicKey,
				counter: authenticator.counter,
				credentialDeviceType: authenticator.credentialDeviceType,
				credentialBackedUp: authenticator.credentialBackedUp,
				userId: authenticator.userId.id,
			}),
		});
	});
});
