import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/user-factory";

describe("Get user by email (E2E)", () => {
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

	test("[GET] /users/email/:email", async () => {
		const user = await userFactory.makeUser();

		const response = await request(app.getHttpServer())
			.get(`/users/email/${user.email}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			user: expect.objectContaining({
				id: user.id.id,
				name: user.name,
				email: user.email,
				avatarUrl: user.avatarUrl,
			}),
		});
	});
});
