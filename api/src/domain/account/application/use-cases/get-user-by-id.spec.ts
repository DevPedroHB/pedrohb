import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeUser } from "test/factories/make-user";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { GetUserByIdUseCase } from "./get-user-by-id";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetUserByIdUseCase;

describe("Get user by id", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new GetUserByIdUseCase(inMemoryUsersRepository);
	});

	it("should be able to get user by id", async () => {
		const user = makeUser();

		await inMemoryUsersRepository.items.push(user);

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
