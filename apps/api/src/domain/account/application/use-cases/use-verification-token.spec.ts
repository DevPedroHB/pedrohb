import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { VerificationTokenFactory } from "test/factories/verification-token-factory";
import { InMemoryVerificationTokensRepository } from "test/repositories/in-memory-verification-tokens-repository";
import { UseVerificationTokenUseCase } from "./use-verification-token";

let inMemoryVerificationTokensRepository: InMemoryVerificationTokensRepository;
let verificationTokenFactory: VerificationTokenFactory;
let sut: UseVerificationTokenUseCase;

describe("Use verification token", () => {
	beforeEach(() => {
		inMemoryVerificationTokensRepository =
			new InMemoryVerificationTokensRepository();
		verificationTokenFactory = new VerificationTokenFactory(
			inMemoryVerificationTokensRepository,
		);
		sut = new UseVerificationTokenUseCase(inMemoryVerificationTokensRepository);
	});

	it("should be able to use a valid token", async () => {
		const token = await verificationTokenFactory.makeVerificationToken();

		const result = await sut.execute({
			identifier: token.identifier,
			token: token.token,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.verificationToken).toBeDefined();
			expect(result.value.verificationToken.token).toBe(token.token);
		}

		expect(inMemoryVerificationTokensRepository.items).not.toContain(token);
	});

	it("should be able to return an error if token is not found", async () => {
		const result = await sut.execute({
			identifier: "non-existent-identifier",
			token: "non-existent-token",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should be able to return an error if token is expired", async () => {
		const token = await verificationTokenFactory.makeVerificationToken({
			expiresAt: new Date(Date.now() - 1000 * 60),
		});

		const result = await sut.execute({
			identifier: token.identifier,
			token: token.token,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryVerificationTokensRepository.items).not.toContain(token);
	});
});
