import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountFactory } from "test/factories/account-factory";
import { UserFactory } from "test/factories/user-factory";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetUserByAccountUseCase } from "./get-user-by-account";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAccountsRepository: InMemoryAccountsRepository;
let userFactory: UserFactory;
let accountFactory: AccountFactory;
let sut: GetUserByAccountUseCase;

describe("Get user by account", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAccountsRepository = new InMemoryAccountsRepository(
			inMemoryUsersRepository,
		);
		userFactory = new UserFactory(inMemoryUsersRepository);
		accountFactory = new AccountFactory(inMemoryAccountsRepository);
		sut = new GetUserByAccountUseCase(inMemoryAccountsRepository);
	});

	it("should be able to get user by account", async () => {
		const user = await userFactory.makeUser();
		const account = await accountFactory.makeAccount({ userId: user.id });

		const result = await sut.execute({
			provider: account.provider,
			providerAccountId: account.providerAccountId,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.accountAndUser).toEqual({
				_props: expect.objectContaining({
					account: expect.objectContaining({
						providerAccountId: account.providerAccountId,
					}),
					user: expect.objectContaining({
						id: user.id,
					}),
				}),
			});
		}
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
