import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { FakeEncrypterRepository } from "@tests/repositories/fake-encrypter-repository";

let fakeEncrypterRepository: FakeEncrypterRepository;

describe("EncrypterRepository", () => {
	beforeEach(() => {
		fakeEncrypterRepository = new FakeEncrypterRepository();
	});

	it("should be able to encrypt and decrypt a valid payload", async () => {
		const payload = { username: "john_doe", age: 30 };
		const token = await fakeEncrypterRepository.encrypt(payload);
		const decrypted = await fakeEncrypterRepository.decrypt(token);

		expect(decrypted).toEqual(payload);
	});

	it("should not be able to decrypt an invalid token", async () => {
		await expect(
			fakeEncrypterRepository.decrypt("invalid-token"),
		).rejects.toThrow(InvalidCredentialsError);
	});

	it("should not be able to encrypt circular JSON payloads", async () => {
		const a: any = {};

		a.self = a;

		await expect(fakeEncrypterRepository.encrypt(a)).rejects.toThrow(
			InvalidCredentialsError,
		);
	});

	it("should return the correct hash", () => {
		const hash = fakeEncrypterRepository.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});
});
