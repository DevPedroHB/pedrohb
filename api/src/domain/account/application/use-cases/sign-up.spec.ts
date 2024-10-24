import { InMemoryEncrypterRepository } from "test/cryptography/in-memory-encrypter-repository";
import { InMemoryHasherRepository } from "test/cryptography/in-memory-hasher-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { SignUpUseCase } from "./sign-up";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryHasherRepository: InMemoryHasherRepository;
let inMemoryEncrypterRepository: InMemoryEncrypterRepository;
let sut: SignUpUseCase;

describe("Sign up", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryHasherRepository = new InMemoryHasherRepository();
		inMemoryEncrypterRepository = new InMemoryEncrypterRepository();
		sut = new SignUpUseCase(
			inMemoryUsersRepository,
			inMemoryHasherRepository,
			inMemoryEncrypterRepository,
		);
	});

	it("should be able to sign up", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "123456",
			avatarUrl: "https://example.com/avatar.jpg",
			birthdate: new Date("1980-01-01"),
		});

		expect(result.isSuccess()).toBe(true);
		expect(result.value).toEqual({
			user: inMemoryUsersRepository.items[0],
			token: expect.any(String),
		});
	});

	it("should be able to hash user password upon sign up", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "123456",
			avatarUrl: "https://example.com/avatar.jpg",
			birthdate: new Date("1980-01-01"),
		});

		const hashedPassword = await inMemoryHasherRepository.hash("123456");

		expect(result.isSuccess()).toBe(true);
		expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
	});
});
