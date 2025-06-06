import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { Password } from "./password";

describe("Password", () => {
	it("should be able to validate a strong password", () => {
		const isValid = Password.isValid("Strong1!");

		expect(isValid).toBe(true);
	});

	it("should not be able to validate a password without uppercase letters", () => {
		const isValid = Password.isValid("weak1!");

		expect(isValid).toBe(false);
	});

	it("should not be able to validate a password without lowercase letters", () => {
		const isValid = Password.isValid("WEAK1!");

		expect(isValid).toBe(false);
	});

	it("should not be able to validate a password without digits", () => {
		const isValid = Password.isValid("WeakPass!");

		expect(isValid).toBe(false);
	});

	it("should not be able to validate a password without special characters", () => {
		const isValid = Password.isValid("WeakPass1");

		expect(isValid).toBe(false);
	});

	it("should be able to hash and compare a password correctly", async () => {
		const plain = "Valid1!";
		const hashed = await Password.hash(plain);
		const isMatch = await Password.compare(plain, hashed);

		expect(isMatch).toBe(true);
	});

	it("should not be able to match a wrong password", async () => {
		const hashed = await Password.hash("Correct1!");
		const isMatch = await Password.compare("Wrong1!", hashed);

		expect(isMatch).toBe(false);
	});

	it("should be able to generate a valid password", () => {
		const generated = Password.generate();

		expect(Password.isValid(generated)).toBe(true);
		expect(generated.length).toBeGreaterThanOrEqual(6);
		expect(generated.length).toBeLessThanOrEqual(32);
	});

	it("should not be able to generate password with invalid length", () => {
		expect(() => Password.generate(5)).toThrow(InvalidCredentialsError);
		expect(() => Password.generate(33)).toThrow(InvalidCredentialsError);
	});

	it("should be able to create a Password object with valid password", async () => {
		const password = await Password.create("Valid1!");

		expect(password).toBeInstanceOf(Password);
		expect(typeof password.toValue()).toBe("string");
	});

	it("should not be able to create a Password object with invalid password", async () => {
		await expect(Password.create("weak")).rejects.toThrow(
			InvalidCredentialsError,
		);
	});

	it("should be able to compare instance password correctly", async () => {
		const raw = "Instance1!";
		const password = await Password.create(raw);
		const isMatch = await password.compare(raw);

		expect(isMatch).toBe(true);
	});
});
