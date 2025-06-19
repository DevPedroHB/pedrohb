import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repository";
import {
	AlreadyExistsError,
	InvalidCredentialsError,
	Password,
} from "@pedrohb/core-ddd";
import { beforeEach, describe, expect, it } from "vitest";
import { SignUpCredentialsUseCase } from "./sign-up-with-credentials-use-case";

let inMemoryUsersRepository: InMemoryUsersRepository;
let signUpCredentialsUseCase: SignUpCredentialsUseCase;

describe("Sign up with credentials", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		signUpCredentialsUseCase = new SignUpCredentialsUseCase(
			inMemoryUsersRepository,
		);
	});

	it("should be able to sign up with valid credentials", async () => {
		const result = await signUpCredentialsUseCase.execute({
			email: "email@example.com",
			password: "PWD@p4ssw0rd",
			confirmPassword: "PWD@p4ssw0rd",
		});

		expect(result.isSuccess()).toBeTruthy();

		if (result.isSuccess()) {
			const userOnRepository = await inMemoryUsersRepository.findByFields({
				email: "email@example.com",
			});

			expect(result.value.user).toBe(userOnRepository);
		}
	});

	it("should not be able to sign up when email already exists", async () => {
		await signUpCredentialsUseCase.execute({
			email: "email@example.com",
			password: "PWD@p4ssw0rd",
			confirmPassword: "PWD@p4ssw0rd",
		});

		const result = await signUpCredentialsUseCase.execute({
			email: "email@example.com",
			password: "PWD@p4ssw0rd",
			confirmPassword: "PWD@p4ssw0rd",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(AlreadyExistsError);
	});

	it("should not be able to sign up when password confirmation does not match", async () => {
		const result = await signUpCredentialsUseCase.execute({
			email: "email@example.com",
			password: "PWD@p4ssw0rd",
			confirmPassword: "SNH@s3nh4",
		});

		expect(result.isError()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidCredentialsError);
	});

	it("should be able to hash the user password correctly", async () => {
		const result = await signUpCredentialsUseCase.execute({
			email: "johndoe@example.com",
			password: "PWD@p4ssw0rd",
			confirmPassword: "PWD@p4ssw0rd",
		});

		expect(result.isSuccess()).toBeTruthy();

		if (result.isSuccess()) {
			const isValid = await Password.compare(
				"PWD@p4ssw0rd",
				result.value.user.passwordHash?.toValue() ?? "",
			);

			expect(isValid).toBe(true);
		}
	});
});
