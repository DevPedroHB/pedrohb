import { AlreadyExistsError } from "@/errors/already-exists-error";
import { ResourceNotFoundError } from "@/errors/resource-not-found-error";
import { DomainEvents } from "@/events/domain-events";
import { makeUserAggregate } from "@tests/factories/user-aggregate-factory";
import { InMemoryUsersRepository } from "@tests/repositories/in-memory-users-repository";

let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Repository", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();

		vi.spyOn(DomainEvents, "dispatchEventsForAggregate").mockImplementation(
			() => {},
		);
	});

	it("should be able to create a new entity", async () => {
		const entity = makeUserAggregate();

		await inMemoryUsersRepository.create(entity);

		expect(inMemoryUsersRepository.items.size).toBe(1);
		expect(DomainEvents.dispatchEventsForAggregate).toHaveBeenCalledWith(
			entity.id,
		);
	});

	it("should not be able to create a duplicate entity", async () => {
		const entity = makeUserAggregate();

		await inMemoryUsersRepository.create(entity);

		await expect(inMemoryUsersRepository.create(entity)).rejects.toThrow(
			AlreadyExistsError,
		);
	});

	it("should be able to update an existing entity", async () => {
		const entity = makeUserAggregate();

		await inMemoryUsersRepository.create(entity);

		entity.name = "Bob";

		await inMemoryUsersRepository.update(entity);

		expect(inMemoryUsersRepository.items.get(entity.id.toValue())?.name).toBe(
			"Bob",
		);
		expect(DomainEvents.dispatchEventsForAggregate).toHaveBeenCalledWith(
			entity.id,
		);
	});

	it("should not be able to update a non-existent entity", async () => {
		const entity = makeUserAggregate();

		await expect(inMemoryUsersRepository.update(entity)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});

	it("should be able to delete an existing entity", async () => {
		const entity = makeUserAggregate();

		await inMemoryUsersRepository.create(entity);
		await inMemoryUsersRepository.delete(entity);

		expect(inMemoryUsersRepository.items.size).toBe(0);
		expect(DomainEvents.dispatchEventsForAggregate).toHaveBeenCalledWith(
			entity.id,
		);
	});

	it("should not be able to delete a non-existent entity", async () => {
		const entity = makeUserAggregate();

		await expect(inMemoryUsersRepository.delete(entity)).rejects.toThrow(
			ResourceNotFoundError,
		);
	});

	it("should be able to fetch all entities", async () => {
		const entityA = makeUserAggregate();
		const entityB = makeUserAggregate();

		await inMemoryUsersRepository.create(entityA);
		await inMemoryUsersRepository.create(entityB);

		const results = await inMemoryUsersRepository.fetchAll();

		expect(results.length).toBe(2);
	});

	it("should be able to find entity by fields", async () => {
		const entity = makeUserAggregate({
			name: "Alice",
		});

		await inMemoryUsersRepository.create(entity);

		const result = await inMemoryUsersRepository.findByFields({
			name: "Alice",
		});

		expect(result?.name).toBe("Alice");
	});

	it("should return null when findByFields does not match", async () => {
		const entity = makeUserAggregate();

		await inMemoryUsersRepository.create(entity);

		const result = await inMemoryUsersRepository.findByFields({
			name: "Unknown",
		});

		expect(result).toBeNull();
	});

	it("should be able to return its hash signature", () => {
		const hash = inMemoryUsersRepository.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});
});
