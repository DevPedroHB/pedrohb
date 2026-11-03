import { PASSWORD_STRENGTH_REGEX, Password } from "./password.js";

describe("Password", () => {
	it("should creates and verifies a hash for a strong password", async () => {
		const plain = "StrongPass123!";

		const password = await Password.create(plain);

		expect(password.toJSON().password).not.toBe(plain);

		await expect(
			Password.verify(password.toJSON().password, plain),
		).resolves.toBe(true);
		await expect(
			Password.verify(password.toJSON().password, "DifferentPass123!"),
		).resolves.toBe(false);
	});

	it("should rejects a password that does not meet the strength requirements", async () => {
		await expect(Password.create("weak")).rejects.toMatchObject({
			code: "INVALID_PASSWORD_STRENGTH",
		});
	});

	it("should generates a strong password of the requested size", () => {
		const generated = Password.generate(20);

		expect(generated).toHaveLength(20);
		expect(generated).toMatch(PASSWORD_STRENGTH_REGEX);
	});

	it("should rejects an invalid generated password size", () => {
		expect(() => Password.generate(11)).toThrow(
			expect.objectContaining({ code: "INVALID_PASSWORD_SIZE" }),
		);
	});
});
