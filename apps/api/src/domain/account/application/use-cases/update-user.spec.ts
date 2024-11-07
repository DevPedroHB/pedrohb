import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InMemoryHasherRepository } from "test/cryptography/in-memory-hasher-repository";
import { UserFactory } from "test/factories/user-factory";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { Roles } from "../../enterprise/entities/user";
import { UpdateUserUseCase } from "./update-user";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryHasherRepository: InMemoryHasherRepository;
let userFactory: UserFactory;
let sut: UpdateUserUseCase;

describe("Update user", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryHasherRepository = new InMemoryHasherRepository();
		userFactory = new UserFactory(inMemoryUsersRepository);
		sut = new UpdateUserUseCase(
			inMemoryUsersRepository,
			inMemoryHasherRepository,
		);
	});

	it("should be able to update a user", async () => {
		const user = await userFactory.makeUser();

		const result = await sut.execute({
			userId: user.id.id,
			name: "John Doe",
			email: "john.doe@example.com",
			password: "3x4mpl3@P4ssw0rd",
			avatarUrl: "https://example.com/avatar.jpg",
			birthdate: new Date("1980-01-01"),
			role: Roles.CLIENT,
			emailVerifiedAt: new Date(),
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.user.name).toBe("John Doe");
			expect(result.value.user.email).toBe("john.doe@example.com");
		}
	});

	it("should be able to return error if user not found", async () => {
		const result = await sut.execute({
			userId: "non-existent-id",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should be able to return error if email is null", async () => {
		const user = await userFactory.makeUser();

		const result = await sut.execute({
			userId: user.id.id,
			email: null,
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});

	it("should be able to set password to null", async () => {
		const user = await userFactory.makeUser();

		const result = await sut.execute({
			userId: user.id.id,
			password: null,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.user.password).toBeNull();
		}
	});

	it("should be able to not change password if undefined", async () => {
		const user = await userFactory.makeUser();

		const result = await sut.execute({
			userId: user.id.id,
		});

		expect(result.isSuccess()).toBe(true);

		if (result.isSuccess()) {
			expect(result.value.user.password).toBe(user.password);
		}
	});
});
