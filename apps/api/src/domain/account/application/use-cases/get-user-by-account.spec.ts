import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountFactory } from "test/factories/account-factory";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetUserByAccountUseCase } from "./get-user-by-account";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAccountsRepository: InMemoryAccountsRepository;
let accountFactory: AccountFactory;
let sut: GetUserByAccountUseCase;

describe("Get user by account", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAccountsRepository = new InMemoryAccountsRepository(
			inMemoryUsersRepository,
		);
		accountFactory = new AccountFactory(
			inMemoryUsersRepository,
			inMemoryAccountsRepository,
		);
		sut = new GetUserByAccountUseCase(inMemoryAccountsRepository);
	});

	it("should be able to get user by account", async () => {
		const { user, account } = await accountFactory.makeAccount();

		const result = await sut.execute({
			provider: account.provider,
			providerAccountId: account.providerAccountId,
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			account: expect.objectContaining({
				_props: expect.objectContaining({
					providerAccountId: account.providerAccountId,
					user: expect.objectContaining({
						id: user.id,
					}),
				}),
			}),
		});
	});

	it("should be able to return an error if user not found", async () => {
		const result = await sut.execute({
			provider: "non-existing-provider",
			providerAccountId: "non-existing-provider-account-id",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
