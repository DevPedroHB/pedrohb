import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/user-factory";

describe("Delete user (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let userFactory: UserFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		userFactory = moduleRef.get(UserFactory);

		await app.init();
	});

	test("[DELETE] /users/:userId", async () => {
		const user = await userFactory.makeUser();

		const response = await request(app.getHttpServer())
			.delete(`/users/${user.id.id}`)
			.send();

		const userOnDatabase = await prisma.user.findUnique({
			where: {
				id: user.id.id,
			},
		});

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			user: expect.objectContaining({
				id: user.id.id,
			}),
		});
		expect(userOnDatabase).toBeNull();
	});
});
