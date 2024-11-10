import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { NotificationFactory } from "test/factories/notification-factory";
import { UserFactory } from "test/factories/user-factory";

describe("Get notification (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let userFactory: UserFactory;
	let notificationFactory: NotificationFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [UserFactory, NotificationFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		jwt = moduleRef.get(JwtService);
		userFactory = moduleRef.get(UserFactory);
		notificationFactory = moduleRef.get(NotificationFactory);

		await app.init();
	});

	test("[GET] /notifications/:notificationId", async () => {
		const user = await userFactory.makeUser();
		const notification = await notificationFactory.makeNotification({
			recipientId: user.id,
		});
		const token = jwt.sign({ sub: user.id.id });

		const response = await request(app.getHttpServer())
			.get(`/notifications/${notification.id.id}`)
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			notification: expect.objectContaining({
				id: notification.id.id,
				recipientId: notification.recipientId.id,
			}),
		});
	});
});
