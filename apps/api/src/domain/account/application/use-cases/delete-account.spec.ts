import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeAccount } from "test/factories/account-factory";
import { InMemoryAccountsRepository } from "test/repositories/in-memory-accounts-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DeleteAccountUseCase } from "./delete-account";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryAccountsRepository: InMemoryAccountsRepository;
let sut: DeleteAccountUseCase;

describe("Delete account", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryAccountsRepository = new InMemoryAccountsRepository(
			inMemoryUsersRepository,
		);
		sut = new DeleteAccountUseCase(inMemoryAccountsRepository);
	});

	it("should be able to delete an existing account", async () => {
		const { user, account } = makeAccount();

		await inMemoryUsersRepository.items.push(user);
		await inMemoryAccountsRepository.items.push(account);

		const result = await sut.execute({
			provider: account.provider,
			providerAccountId: account.providerAccountId,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value?.account).toEqual(account);
		}

		expect(inMemoryAccountsRepository.items).not.toContain(account);
	});

	it("should be able to return error if account is not found", async () => {
		const result = await sut.execute({
			provider: "non-existent-provider",
			providerAccountId: "non-existent-provider-account--id",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
