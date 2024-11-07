import {
	TestAggregateRoot,
	TestAggregateRootEvent,
} from "test/entities/test-aggregate-root";
import { UniqueEntityID } from "../entities/unique-entity-id";
import { DomainEvents } from "./domain-events";

describe("Domain events", () => {
	afterEach(() => {
		DomainEvents.clearHandlers();
		DomainEvents.clearMarkedAggregates();
	});

	it("should be able to register a domain event handler", () => {
		const callback = vi.fn();

		DomainEvents.register(callback, TestAggregateRootEvent.name);

		expect(
			DomainEvents["handlersMap"][TestAggregateRootEvent.name],
		).toHaveLength(1);
		expect(DomainEvents["handlersMap"][TestAggregateRootEvent.name][0]).toBe(
			callback,
		);
	});

	it("should be able to dispatch a domain event to the registered handler", () => {
		const callback = vi.fn();
		const event = new TestAggregateRootEvent(new UniqueEntityID());

		DomainEvents.register(callback, TestAggregateRootEvent.name);
		DomainEvents["dispatch"](event);

		expect(callback).toHaveBeenCalledWith(event);
	});

	it("should be able to mark an aggregate for dispatch and dispatch its events", () => {
		const aggregate = TestAggregateRoot.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
		});

		DomainEvents.markAggregateForDispatch(aggregate);

		expect(DomainEvents["markedAggregates"]).toHaveLength(1);

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(DomainEvents["markedAggregates"]).toHaveLength(0);
		expect(aggregate.domainEvents).toHaveLength(0);
	});

	it("should be able to clear all event handlers", () => {
		const callback = vi.fn();

		DomainEvents.register(callback, TestAggregateRootEvent.name);

		expect(
			DomainEvents["handlersMap"][TestAggregateRootEvent.name],
		).toHaveLength(1);

		DomainEvents.clearHandlers();

		expect(
			DomainEvents["handlersMap"][TestAggregateRootEvent.name],
		).toBeUndefined();
	});

	it("should be able to clear all marked aggregates", () => {
		const aggregate = TestAggregateRoot.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
		});

		DomainEvents.markAggregateForDispatch(aggregate);

		expect(DomainEvents["markedAggregates"]).toHaveLength(1);

		DomainEvents.clearMarkedAggregates();

		expect(DomainEvents["markedAggregates"]).toHaveLength(0);
	});

	it("should be able to not dispatch events if DomainEvents.shouldRun is false", () => {
		const callback = vi.fn();
		const event = new TestAggregateRootEvent(new UniqueEntityID());

		DomainEvents.register(callback, TestAggregateRootEvent.name);
		DomainEvents.shouldRun = false;

		DomainEvents["dispatch"](event);

		expect(callback).not.toHaveBeenCalled();

		DomainEvents.shouldRun = true;
	});
});
