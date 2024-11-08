import { Roles } from "@/domain/account/enterprise/entities/user";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { UserFactory } from "test/factories/user-factory";

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

		const newData = {
			userId: user.id.id,
			name: "John Doe",
			email: "john.doe@example.com",
			password: "3x4mpl3@P4ssw0rd",
			avatarUrl: "https://example.com/avatar.jpg",
			birthdate: new Date("1980-01-01"),
			role: Roles.CLIENT,
			emailVerifiedAt: new Date(),
		};

		const response = await request(app.getHttpServer())
			.put(`/users/${user.id.id}`)
			.send(newData);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			user: expect.objectContaining({
				name: newData.name,
				email: newData.email,
			}),
		});
	});
});
