import { makeUser } from "test/factories/make-user";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { CreateAccountUseCase } from "./create-account";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAccountsRepository: InMemoryAccountsRepository;
let sut: CreateAccountUseCase;

describe("Create Account", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAccountsRepository = new InMemoryAccountsRepository(
			inMemoryUsersRepository,
		);
		sut = new CreateAccountUseCase(inMemoryAccountsRepository);
	});

	it("should be able to create a new account", async () => {
		const user = makeUser();

		await inMemoryUsersRepository.items.push(user);

		const result = await sut.execute({
			provider: "google",
			providerAccountId: "provider-account-id-123",
			type: "oauth",
			refreshToken: "refresh-token-abc",
			accessToken: "access-token-xyz",
			expiresAt: 3600,
			tokenType: "Bearer",
			scope: "read,write",
			tokenId: "token-id-789",
			userId: user.id.id,
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value?.account).toBeDefined();
		expect(result.value?.account.provider).toBe("google");
		expect(inMemoryAccountsRepository.items).toHaveLength(1);
		expect(inMemoryAccountsRepository.items[0].providerAccountId).toBe(
			"provider-account-id-123",
		);
	});
});
