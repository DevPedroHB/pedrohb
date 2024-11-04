import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeVerificationToken } from "test/factories/make-verification-token";
import { InMemoryVerificationTokensRepository } from "test/repositories/in-memory-verification-tokens-repository";
import { UseVerificationTokenUseCase } from "./use-verification-token";

let inMemoryVerificationTokensRepository: InMemoryVerificationTokensRepository;
let sut: UseVerificationTokenUseCase;

describe("Use verification token", () => {
	beforeEach(() => {
		inMemoryVerificationTokensRepository =
			new InMemoryVerificationTokensRepository();
		sut = new UseVerificationTokenUseCase(inMemoryVerificationTokensRepository);
	});

	it("should be able to use a valid token", async () => {
		const token = makeVerificationToken();

		await inMemoryVerificationTokensRepository.items.push(token);

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
		const token = makeVerificationToken({
			expiresAt: new Date(Date.now() - 1000 * 60),
		});

		await inMemoryVerificationTokensRepository.items.push(token);

		const result = await sut.execute({
			identifier: token.identifier,
			token: token.token,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryVerificationTokensRepository.items).not.toContain(token);
	});
});
