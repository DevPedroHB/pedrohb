import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error";
import { InMemoryVerificationTokensRepository } from "test/repositories/in-memory-verification-tokens-repository";
import { CreateTokenUseCase } from "./create-token";

let inMemoryVerificationTokensRepository: InMemoryVerificationTokensRepository;
let sut: CreateTokenUseCase;

describe("Create token", () => {
	beforeEach(() => {
		inMemoryVerificationTokensRepository =
			new InMemoryVerificationTokensRepository();
		sut = new CreateTokenUseCase(inMemoryVerificationTokensRepository);
	});

	it("should be able to create a token", async () => {
		const result = await sut.execute({
			identifier: "test-identifier",
			token: "sample-token",
			expiresAt: new Date(Date.now() + 1000 * 60 * 60),
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.verificationToken).toBeDefined();
			expect(result.value.verificationToken.identifier).toBe("test-identifier");
			expect(result.value.verificationToken.token).toBe("sample-token");
			expect(result.value.verificationToken.expiresAt).toBeInstanceOf(Date);
			expect(inMemoryVerificationTokensRepository.items).toContainEqual(
				result.value.verificationToken,
			);
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
