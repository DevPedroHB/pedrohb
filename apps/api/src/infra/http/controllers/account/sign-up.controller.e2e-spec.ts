import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Sign up (E2E)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		await app.init();
	});

	test("[POST] /users/sign-up", async () => {
		const data = {
			name: "John Doe",
			email: "john.doe@example.com",
			password: "3x4mpl3@P4ssw0rd",
			avatarUrl: "https://example.com/avatar.jpg",
			birthdate: new Date("1980-01-01"),
		};

		const response = await request(app.getHttpServer())
			.post("/users/sign-up")
			.send(data);

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			user: expect.objectContaining({
				name: data.name,
				email: data.email,
				avatarUrl: data.avatarUrl,
			}),
			token: expect.any(String),
		});
	});
});
