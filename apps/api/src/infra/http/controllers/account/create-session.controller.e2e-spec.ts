import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeSession } from "test/factories/session-factory";
import { UserFactory } from "test/factories/user-factory";

describe("Create session (E2E)", () => {
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

	test("[POST] /sessions/:userId", async () => {
		const user = await userFactory.makeUser();
		const session = makeSession({ userId: user.id });

		const response = await request(app.getHttpServer())
			.post(`/sessions/${session.userId.id}`)
			.send({
				sessionToken: session.sessionToken,
				expiresAt: session.expiresAt,
			});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			session: expect.objectContaining({
				sessionToken: session.sessionToken,
				expiresAt: session.expiresAt.toISOString(),
				userId: session.userId.id,
			}),
		});
	});
});
