import { FakeHasherRepository } from "@tests/repositories/fake-hasher-repository";

let fakeHasherRepository: FakeHasherRepository;

describe("HasherRepository", () => {
	beforeEach(() => {
		fakeHasherRepository = new FakeHasherRepository();
	});

	it("should be able to generate a valid hash for a non-empty string", async () => {
		const plainText = "mySecret";
		const hash = await fakeHasherRepository.hash(plainText);

		expect(typeof hash).toBe("string");
		expect(hash).toHaveLength(8);
		expect(/^[0-9a-f]{8}$/i.test(hash)).toBe(true);
	});

	it("should be able to generate the same hash for the same input", async () => {
		const plainText = "duplicateTest";
		const hash1 = await fakeHasherRepository.hash(plainText);
		const hash2 = await fakeHasherRepository.hash(plainText);

		expect(hash1).toBe(hash2);
	});

	it("should be able to compare a plain text with its correct hash", async () => {
		const plainText = "compareTest";
		const hash = await fakeHasherRepository.hash(plainText);
		const result = await fakeHasherRepository.compare(plainText, hash);

		expect(result).toBe(true);
	});

	it("should not be able to compare a plain text with an incorrect hash", async () => {
		const plainText = "compareTest";
		const wrongHash = "ffffffff";
		const result = await fakeHasherRepository.compare(plainText, wrongHash);

		expect(result).toBe(false);
	});

	it("should be able to generate a valid hash for an empty string", async () => {
		const hash = await fakeHasherRepository.hash("");

		expect(typeof hash).toBe("string");
		expect(hash).toHaveLength(8);
	});

	it("should return the correct hash signature string", () => {
		const hash = fakeHasherRepository.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});
});
