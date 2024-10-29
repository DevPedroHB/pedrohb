import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error";
import { InMemoryTokensRepository } from "test/repositories/in-memory-tokens-repository";
import { CreateTokenUseCase } from "./create-token";

let inMemoryTokensRepository: InMemoryTokensRepository;
let sut: CreateTokenUseCase;

describe("Create token", () => {
	beforeEach(() => {
		inMemoryTokensRepository = new InMemoryTokensRepository();
		sut = new CreateTokenUseCase(inMemoryTokensRepository);
	});

	it("should be able to create a token", async () => {
		const result = await sut.execute({
			identifier: "test-identifier",
			token: "sample-token",
			expiresAt: new Date(Date.now() + 1000 * 60 * 60),
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.token).toBeDefined();
			expect(result.value.token.identifier).toBe("test-identifier");
			expect(result.value.token.token).toBe("sample-token");
			expect(result.value.token.expiresAt).toBeInstanceOf(Date);
			expect(inMemoryTokensRepository.items).toContainEqual(result.value.token);
		}
	});

	it("should be able to return an error if expiration date is in the past", async () => {
		const result = await sut.execute({
			identifier: "test-identifier",
			token: "sample-token",
			expiresAt: new Date(Date.now() - 1000 * 60),
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidCredentialsError);
	});
});
