import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountFactory } from "test/factories/account-factory";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetAccountUseCase } from "./get-account";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAccountsRepository: InMemoryAccountsRepository;
let accountFactory: AccountFactory;
let sut: GetAccountUseCase;

describe("Get account", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAccountsRepository = new InMemoryAccountsRepository(
			inMemoryUsersRepository,
		);
		accountFactory = new AccountFactory(
			inMemoryUsersRepository,
			inMemoryAccountsRepository,
		);
		sut = new GetAccountUseCase(inMemoryAccountsRepository);
	});

	it("should be able to get an existing account", async () => {
		const { account } = await accountFactory.makeAccount();

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
