import { DomainEvents } from "@/core/events/domain-events";
import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { waitFor } from "test/utils/wait-for";
import { DatabaseModule } from "../database/database.module";
import { PrismaService } from "../database/prisma/prisma.service";

describe("On user created (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);

		DomainEvents.shouldRun = true;

		await app.init();
	});

	it("should be able to send a notification when a user is created", async () => {
		const response = await request(app.getHttpServer())
			.post("/users/sign-up")
			.send({
				name: "John Doe",
				email: "john.doe@example.com",
				password: "3x4mpl3@P4ssw0rd",
				avatarUrl: "https://example.com/avatar.jpg",
				birthdate: new Date("1980-01-01"),
			});

		await waitFor(async () => {
			const notificationOnDatabase = await prisma.notification.findFirst({
				where: {
					recipientId: response.body.user.id,
				},
			});

			expect(notificationOnDatabase).not.toBeNull();
		});
	});
});
