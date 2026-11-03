import { Argon2idHasher } from "./argon2-hasher.js";

describe("Argon2idHasher", () => {
	const argon2idHasher = new Argon2idHasher();

	it("should hashes a plain value and verifies it", async () => {
		const plain = "um valor qualquer";
		const digest = await argon2idHasher.hash(plain);

		expect(digest).not.toBe(plain);

		await expect(argon2idHasher.verify(digest, plain)).resolves.toBe(true);
		await expect(
			argon2idHasher.verify(digest, "um valor diferente"),
		).resolves.toBe(false);
	});
});
