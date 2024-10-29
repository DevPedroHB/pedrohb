import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DeleteUserUseCase } from "./delete-user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: DeleteUserUseCase;

describe("Delete user", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new DeleteUserUseCase(inMemoryUsersRepository);
	});

	it("should be able to delete an existing user", async () => {
		const user = makeUser();

		await inMemoryUsersRepository.items.push(user);

		const result = await sut.execute({
			userId: user.id.id,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.user).toEqual(user);
		}

		expect(inMemoryUsersRepository.items).not.toContain(user);
	});

	it("should be able to return error if user is not found", async () => {
		const result = await sut.execute({
			userId: "non-existent-id",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
