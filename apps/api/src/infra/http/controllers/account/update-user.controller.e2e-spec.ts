import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory, makeUser } from "test/factories/user-factory";

describe("Update user (E2E)", () => {
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

	test("[PUT] /users/:userId", async () => {
		const user = await userFactory.makeUser();
		const newUser = makeUser({ password: "3x4mpl3@P4ssw0rd" }, user.id);

		const response = await request(app.getHttpServer())
			.put(`/users/${user.id.id}`)
			.send({
				name: newUser.name,
				email: newUser.email,
				password: newUser.password,
				avatarUrl: newUser.avatarUrl,
				birthdate: newUser.birthdate,
				role: newUser.role,
				emailVerifiedAt: newUser.emailVerifiedAt,
			});

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			user: expect.objectContaining({
				name: newUser.name,
				email: newUser.email,
				avatarUrl: newUser.avatarUrl,
				birthdate: newUser.birthdate.toISOString(),
				role: newUser.role,
				emailVerifiedAt: newUser.emailVerifiedAt ?? null,
			}),
		});
	});
});
