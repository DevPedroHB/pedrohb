import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserFactory } from "test/factories/user-factory";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetUserByEmailUseCase } from "./get-user-by-email";

let inMemoryUsersRepository: InMemoryUsersRepository;
let userFactory: UserFactory;
let sut: GetUserByEmailUseCase;

describe("Get user by email", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		userFactory = new UserFactory(inMemoryUsersRepository);
		sut = new GetUserByEmailUseCase(inMemoryUsersRepository);
	});

	it("should be able to get user by email", async () => {
		const user = await userFactory.makeUser();

		const result = await sut.execute({
			email: user.email,
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			user,
		});
	});

	it("should be able to return an error if user not found", async () => {
		const result = await sut.execute({
			email: "non-existing-email",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
