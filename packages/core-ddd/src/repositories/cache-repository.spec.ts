import { InMemoryCacheRepository } from "@tests/repositories/in-memory-cache-repository";

let inMemoryCacheRepository: InMemoryCacheRepository;

describe("CacheRepository", () => {
	beforeEach(() => {
		inMemoryCacheRepository = new InMemoryCacheRepository(5); // 5 seconds

		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should be able to set and get a value", async () => {
		await inMemoryCacheRepository.set("key1", "value1");

		const result = await inMemoryCacheRepository.get("key1");

		expect(result).toBe("value1");
	});

	it("should not be able to get a value if key was never set", async () => {
		const result = await inMemoryCacheRepository.get("unknown");

		expect(result).toBeNull();
	});

	it("should not be able to get a value if it has expired", async () => {
		await inMemoryCacheRepository.set("key1", "value1");

		vi.advanceTimersByTime(6 * 1000); // 6 seconds

		const result = await inMemoryCacheRepository.get("key1");

		expect(result).toBeNull();
	});

	it("should be able to override TTL with custom value", async () => {
		await inMemoryCacheRepository.set("key1", "value1", 10); // 10 seconds

		const entry = inMemoryCacheRepository.items.get("key1");

		expect(entry?.expiresAt).toBeGreaterThan(Date.now());
	});

	it("should be able to delete a key", async () => {
		await inMemoryCacheRepository.set("key1", "value1");
		await inMemoryCacheRepository.del("key1");

		const result = await inMemoryCacheRepository.get("key1");

		expect(result).toBeNull();
	});

	it("should return the correct hash", () => {
		const hash = inMemoryCacheRepository.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});
});
