import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { SessionFactory } from "test/factories/session-factory";
import { UserFactory } from "test/factories/user-factory";

describe("Get session (E2E)", () => {
	let app: INestApplication;
	let userFactory: UserFactory;
	let sessionFactory: SessionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory, SessionFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		userFactory = moduleRef.get(UserFactory);
		sessionFactory = moduleRef.get(SessionFactory);

		await app.init();
	});

	test("[GET] /sessions/:sessionToken", async () => {
		const user = await userFactory.makeUser();
		const session = await sessionFactory.makeSession({ userId: user.id });

		const response = await request(app.getHttpServer())
			.get(`/sessions/${session.sessionToken}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			session: expect.objectContaining({
				sessionToken: session.sessionToken,
				user: expect.objectContaining({
					id: user.id.id,
				}),
			}),
		});
	});
});
