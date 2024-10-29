import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeToken } from "test/factories/make-token";
import { InMemoryTokensRepository } from "test/repositories/in-memory-tokens-repository";
import { UseVerificationTokenUseCase } from "./use-verification-token";

let inMemoryTokensRepository: InMemoryTokensRepository;
let sut: UseVerificationTokenUseCase;

describe("Use verification token", () => {
	beforeEach(() => {
		inMemoryTokensRepository = new InMemoryTokensRepository();
		sut = new UseVerificationTokenUseCase(inMemoryTokensRepository);
	});

	it("should be able to use a valid token", async () => {
		const token = makeToken();

		await inMemoryTokensRepository.items.push(token);

		const result = await sut.execute({
			identifier: token.identifier,
			token: token.token,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.token).toBeDefined();
			expect(result.value.token.token).toBe(token.token);
		}

		expect(inMemoryTokensRepository.items).not.toContain(token);
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
		const token = makeToken({
			expiresAt: new Date(Date.now() - 1000 * 60),
		});

		await inMemoryTokensRepository.items.push(token);

		const result = await sut.execute({
			identifier: token.identifier,
			token: token.token,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
		expect(inMemoryTokensRepository.items).not.toContain(token);
	});
});
