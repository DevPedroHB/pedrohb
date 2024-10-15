import {
	TestAggregateRoot,
	TestAggregateRootEvent,
} from "test/entities/test-aggregate-root";
import { DomainEvents } from "../events/domain-events";

describe("Aggregate root", () => {
	it("should be able to add domain events", () => {
		const aggregate = TestAggregateRoot.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
		});

		expect(aggregate.domainEvents).toHaveLength(1);
		expect(aggregate.domainEvents[0]).toBeInstanceOf(TestAggregateRootEvent);
	});

	it("should be able to clear domain events after dispatching", () => {
		const aggregate = TestAggregateRoot.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
		});

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(aggregate.domainEvents).toHaveLength(0);
	});

	it("should be able to dispatch and listen to domain events", async () => {
		const callbackSpy = vi.fn();

		DomainEvents.register(callbackSpy, TestAggregateRootEvent.name);

		const aggregate = TestAggregateRoot.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
		});

		expect(aggregate.domainEvents).toHaveLength(1);

		DomainEvents.dispatchEventsForAggregate(aggregate.id);

		expect(callbackSpy).toHaveBeenCalled();
		expect(callbackSpy).toHaveBeenCalledWith(
			expect.any(TestAggregateRootEvent),
		);
		expect(aggregate.domainEvents).toHaveLength(0);
	});
});
