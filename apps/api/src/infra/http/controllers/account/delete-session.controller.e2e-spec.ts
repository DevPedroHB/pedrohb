import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { SessionFactory } from "test/factories/session-factory";
import { UserFactory } from "test/factories/user-factory";

describe("Delete session (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let userFactory: UserFactory;
	let sessionFactory: SessionFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory, SessionFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		userFactory = moduleRef.get(UserFactory);
		sessionFactory = moduleRef.get(SessionFactory);

		await app.init();
	});

	test("[DELETE] /sessions/:sessionToken", async () => {
		const user = await userFactory.makeUser();
		const session = await sessionFactory.makeSession({ userId: user.id });

		const response = await request(app.getHttpServer())
			.delete(`/sessions/${session.sessionToken}`)
			.send();

		const sessionOnDatabase = await prisma.session.findUnique({
			where: {
				sessionToken: session.sessionToken,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			session: expect.objectContaining({
				sessionToken: session.sessionToken,
				userId: session.userId.id,
			}),
		});
		expect(sessionOnDatabase).toBeNull();
	});
});
