import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { VerificationTokenFactory } from "test/factories/verification-token-factory";

describe("Use verification token (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let verificationTokenFactory: VerificationTokenFactory;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
			providers: [VerificationTokenFactory],
		}).compile();

		app = moduleRef.createNestApplication();

		prisma = moduleRef.get(PrismaService);
		verificationTokenFactory = moduleRef.get(VerificationTokenFactory);

		await app.init();
	});

	test("[PATCH] /verification-tokens/:identifier/:token", async () => {
		const verificationToken =
			await verificationTokenFactory.makeVerificationToken();

		const response = await request(app.getHttpServer())
			.patch(
				`/verification-tokens/${verificationToken.identifier}/${verificationToken.token}`,
			)
			.send();

		const verificationTokenOnDatabase =
			await prisma.verificationToken.findUnique({
				where: {
					identifier_token: {
						identifier: verificationToken.identifier,
						token: verificationToken.token,
					},
				},
			});

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({
			verificationToken: expect.objectContaining({
				identifier: verificationToken.identifier,
				token: verificationToken.token,
			}),
		});
		expect(verificationTokenOnDatabase).toBeNull();
	});
});
