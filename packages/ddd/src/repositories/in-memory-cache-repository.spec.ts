import { DDDError } from "#/errors/ddd-error.js";
import {
	type MakeTestAggregate,
	makeTestAggregate,
} from "#test/factories/make-test-aggregate.js";
import type { TestAggregate } from "#test/test-aggregate.js";
import { InMemoryCacheRepository } from "./in-memory-cache-repository.js";

let inMemoryCacheRepository: InMemoryCacheRepository<TestAggregate>;
let testAggregate: MakeTestAggregate;
let key: string;

describe("InMemoryCacheRepository", () => {
	beforeEach(() => {
		inMemoryCacheRepository = new InMemoryCacheRepository<TestAggregate>();
		testAggregate = makeTestAggregate();
		key = `${testAggregate.constructor.name}:${testAggregate.id.id}`;
	});

	it("stores, retrieves, checks, and deletes values", async () => {
		await expect(inMemoryCacheRepository.get(key)).resolves.toBeNull();
		await expect(inMemoryCacheRepository.has(key)).resolves.toBe(false);

		await inMemoryCacheRepository.set(key, testAggregate.aggregate);

		await expect(inMemoryCacheRepository.get(key)).resolves.toBe(
			testAggregate.aggregate,
		);
		await expect(inMemoryCacheRepository.has(key)).resolves.toBe(true);

		await inMemoryCacheRepository.del(key);

		await expect(inMemoryCacheRepository.get(key)).resolves.toBeNull();
		await expect(inMemoryCacheRepository.has(key)).resolves.toBe(false);
	});

	it("expires entries after their TTL and purges them", async () => {
		vi.useFakeTimers();

		try {
			await inMemoryCacheRepository.set(key, testAggregate.aggregate, 1);

			vi.advanceTimersByTime(1_000);

			await expect(inMemoryCacheRepository.get(key)).resolves.toBeNull();
			await expect(inMemoryCacheRepository.has(key)).resolves.toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});

	it("rejects non-positive or non-finite TTL values", async () => {
		for (const ttl of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) {
			await expect(
				inMemoryCacheRepository.set(key, testAggregate.aggregate, ttl),
			).rejects.toThrow(DDDError);
		}
	});
});
