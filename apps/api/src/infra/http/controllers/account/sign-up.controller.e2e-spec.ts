import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeUser } from "test/factories/user-factory";

describe("Sign up (E2E)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
		}).compile();

		app = moduleRef.createNestApplication();

		await app.init();
	});

	test("[POST] /users/sign-up", async () => {
		const user = makeUser({ password: "3x4mpl3@P4ssw0rd" });

		const response = await request(app.getHttpServer())
			.post("/users/sign-up")
			.send({
				name: user.name,
				email: user.email,
				password: user.password,
				avatarUrl: user.avatarUrl,
				birthdate: user.birthdate,
				emailVerifiedAt: user.emailVerifiedAt,
			});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			user: expect.objectContaining({
				name: user.name,
				email: user.email,
				avatarUrl: user.avatarUrl,
			}),
			token: expect.any(String),
		});
	});
});
