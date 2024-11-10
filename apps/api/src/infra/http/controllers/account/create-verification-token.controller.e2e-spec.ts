import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { makeVerificationToken } from "test/factories/verification-token-factory";

describe("Create verification token (E2E)", () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule, DatabaseModule],
		}).compile();

		app = moduleRef.createNestApplication();

		await app.init();
	});

	test("[POST] /verification-tokens", async () => {
		const verificationToken = makeVerificationToken();

		const response = await request(app.getHttpServer())
			.post("/verification-tokens")
			.send({
				identifier: verificationToken.identifier,
				token: verificationToken.token,
				expiresAt: verificationToken.expiresAt,
			});

		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({
			verificationToken: expect.objectContaining({
				identifier: verificationToken.identifier,
				token: verificationToken.token,
				expiresAt: verificationToken.expiresAt.toISOString(),
			}),
		});
	});
});
