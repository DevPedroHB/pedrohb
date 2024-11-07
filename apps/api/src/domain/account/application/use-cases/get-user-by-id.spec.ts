import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UserFactory } from "test/factories/user-factory";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetUserByIdUseCase } from "./get-user-by-id";

let inMemoryUsersRepository: InMemoryUsersRepository;
let userFactory: UserFactory;
let sut: GetUserByIdUseCase;

describe("Get user by id", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		userFactory = new UserFactory(inMemoryUsersRepository);
		sut = new GetUserByIdUseCase(inMemoryUsersRepository);
	});

	it("should be able to get user by id", async () => {
		const user = await userFactory.makeUser();

		const result = await sut.execute({
			userId: user.id.id,
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			user,
		});
	});

	it("should be able to return an error if user not found", async () => {
		const result = await sut.execute({
			userId: "non-existing-id",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
