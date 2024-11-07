import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserFactory } from "test/factories/user-factory";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { DeleteUserUseCase } from "./delete-user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let userFactory: UserFactory;
let sut: DeleteUserUseCase;

describe("Delete user", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		userFactory = new UserFactory(inMemoryUsersRepository);
		sut = new DeleteUserUseCase(inMemoryUsersRepository);
	});

	it("should be able to delete an existing user", async () => {
		const user = await userFactory.makeUser();

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
