import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeAccount } from "test/factories/make-account";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetUserByAccountUseCase } from "./get-user-by-account";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAccountsRepository: InMemoryAccountsRepository;
let sut: GetUserByAccountUseCase;

describe("Get user by account", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAccountsRepository = new InMemoryAccountsRepository(
			inMemoryUsersRepository,
		);
		sut = new GetUserByAccountUseCase(inMemoryAccountsRepository);
	});

	it("should be able to get user by account", async () => {
		const { user, account } = makeAccount();

		await inMemoryUsersRepository.items.push(user);
		await inMemoryAccountsRepository.items.push(account);

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
