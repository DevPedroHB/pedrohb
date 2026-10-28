import { DomainEventBus } from "#/events/domain-event-bus.js";
import { makeTestAggregate } from "#test/factories/make-test-aggregate.js";
import type { TestAggregate } from "#test/test-aggregate.js";
import { TestDomainEvent } from "#test/test-domain-event.js";
import { InMemoryRepository } from "./in-memory-repository.js";

describe("InMemoryRepository", () => {
	let domainEventBus: DomainEventBus;
	let inMemoryRepository: InMemoryRepository<TestAggregate, "id">;

	beforeEach(() => {
		domainEventBus = new DomainEventBus();
		inMemoryRepository = new InMemoryRepository(domainEventBus, "id");
	});

	it("returns no items before creation and retrieves created items", async () => {
		const { id, aggregate } = makeTestAggregate();

		await expect(inMemoryRepository.findAll()).resolves.toEqual([]);
		await expect(inMemoryRepository.findByKey(id)).resolves.toBeNull();

		await inMemoryRepository.create(aggregate);

		await expect(inMemoryRepository.findAll()).resolves.toEqual([aggregate]);
		await expect(inMemoryRepository.findByKey(id)).resolves.toBe(aggregate);
	});

	it("rejects duplicate creation and updating or deleting missing items", async () => {
		const { id, aggregate } = makeTestAggregate();

		await inMemoryRepository.create(aggregate);

		await expect(inMemoryRepository.create(aggregate)).rejects.toThrow(
			expect.objectContaining({ code: "ITEM_ALREADY_EXISTS" }),
		);
		await expect(
			inMemoryRepository.update(makeTestAggregate().aggregate),
		).rejects.toThrow(expect.objectContaining({ code: "ITEM_NOT_FOUND" }));
		await expect(
			inMemoryRepository.delete(makeTestAggregate().aggregate),
		).rejects.toThrow(expect.objectContaining({ code: "ITEM_NOT_FOUND" }));
		await expect(inMemoryRepository.findByKey(id)).resolves.toBe(aggregate);
	});

	it("updates and deletes existing items", async () => {
		const { id, aggregate } = makeTestAggregate();

		await inMemoryRepository.create(aggregate);

		const updated = makeTestAggregate({}, id).aggregate;

		await inMemoryRepository.update(updated);

		await expect(inMemoryRepository.findByKey(id)).resolves.toBe(updated);

		await inMemoryRepository.delete(updated);

		await expect(inMemoryRepository.findByKey(id)).resolves.toBeNull();
		await expect(inMemoryRepository.findAll()).resolves.toEqual([]);
	});

	it("dispatches domain events when creating an aggregate", async () => {
		const listener = vi.fn();

		domainEventBus.register(TestDomainEvent, listener);

		const { aggregate } = makeTestAggregate();

		await inMemoryRepository.create(aggregate);

		expect(listener).toHaveBeenCalledOnce();
		expect(listener).toHaveBeenCalledWith(expect.any(TestDomainEvent));
	});
});
