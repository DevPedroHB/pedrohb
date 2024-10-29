import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeAccount } from "test/factories/make-account";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetAccountUseCase } from "./get-account";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAccountsRepository: InMemoryAccountsRepository;
let sut: GetAccountUseCase;

describe("Get account", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAccountsRepository = new InMemoryAccountsRepository(
			inMemoryUsersRepository,
		);
		sut = new GetAccountUseCase(inMemoryAccountsRepository);
	});

	it("should be able to get an existing account", async () => {
		const { user, account } = makeAccount();

		await inMemoryUsersRepository.items.push(user);
		await inMemoryAccountsRepository.items.push(account);

		const result = await sut.execute({
			provider: account.provider,
			providerAccountId: account.providerAccountId,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.account).toBeDefined();
			expect(result.value.account.provider).toBe(account.provider);
			expect(result.value.account.providerAccountId).toBe(
				account.providerAccountId,
			);
		}
	});

	it("should be able to return an error if account does not exist", async () => {
		const result = await sut.execute({
			provider: "non-existent-provider",
			providerAccountId: "non-existent-provider-account-id",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
