import { DDDError } from "#/errors/ddd-error.js";
import { DomainEventBus } from "#/events/domain-event-bus.js";
import { makeTestAggregate } from "#test/factories/make-test-aggregate.js";
import type { TestAggregate } from "#test/test-aggregate.js";
import { TestDomainEvent } from "#test/test-domain-event.js";
import { InMemoryRepository } from "./in-memory-repository.js";

let domainEventBus: DomainEventBus;
let inMemoryRepository: InMemoryRepository<TestAggregate>;

describe("InMemoryRepository", () => {
	beforeEach(() => {
		domainEventBus = new DomainEventBus();
		inMemoryRepository = new InMemoryRepository<TestAggregate>(domainEventBus);
	});

	it("should creates, finds, updates, and deletes entities", async () => {
		const { aggregate } = makeTestAggregate();

		await inMemoryRepository.create(aggregate);

		await expect(inMemoryRepository.findById(aggregate.id)).resolves.toBe(
			aggregate,
		);

		aggregate.name = "Updated";

		await inMemoryRepository.update(aggregate);

		await expect(inMemoryRepository.findById(aggregate.id)).resolves.toBe(
			aggregate,
		);

		await inMemoryRepository.delete(aggregate);

		await expect(inMemoryRepository.findById(aggregate.id)).resolves.toBeNull();
	});

	it("should rejects duplicate creates and missing updates or deletes", async () => {
		const { aggregate } = makeTestAggregate();

		await inMemoryRepository.create(aggregate);

		await expect(inMemoryRepository.create(aggregate)).rejects.toMatchObject({
			code: "ITEM_ALREADY_EXISTS",
		});
		await expect(
			inMemoryRepository.update(makeTestAggregate().aggregate),
		).rejects.toBeInstanceOf(DDDError);
		await expect(
			inMemoryRepository.delete(makeTestAggregate().aggregate),
		).rejects.toBeInstanceOf(DDDError);
	});

	it("should returns paginated results with sorting", async () => {
		const first = makeTestAggregate({ name: "Alice", age: 30 }).aggregate;
		const second = makeTestAggregate({ name: "Bob", age: 20 }).aggregate;
		const third = makeTestAggregate({ name: "Carol", age: 40 }).aggregate;

		await inMemoryRepository.create(first);
		await inMemoryRepository.create(second);
		await inMemoryRepository.create(third);

		await expect(
			inMemoryRepository.findAll({
				page: 2,
				perPage: 1,
				orderBy: { age: "asc" },
			}),
		).resolves.toMatchObject({
			items: [first],
			total: 3,
			page: 2,
			perPage: 1,
			totalPages: 3,
		});
	});

	it("should dispatches aggregate events once and records them in the outbox", async () => {
		const { aggregate } = makeTestAggregate();
		const handler = vi.fn();

		domainEventBus.register(TestDomainEvent, handler);

		const event = aggregate.events[0];

		await inMemoryRepository.create(aggregate);
		await inMemoryRepository.update(aggregate);

		expect(handler).toHaveBeenCalledTimes(1);
		expect(aggregate.events).toHaveLength(0);
		expect(Array.from(inMemoryRepository.outbox.values())[0]).toMatchObject({
			event,
			dispatched: true,
		});
	});
});
