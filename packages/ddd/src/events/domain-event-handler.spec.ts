import { makeTestAggregate } from "#test/factories/make-test-aggregate.js";
import { TestDomainEventHandler } from "#test/test-domain-event-handler.js";
import { DomainEventBus } from "./domain-event-bus.js";

describe("DomainEventHandler", () => {
	it("should handle dispatched domain events", async () => {
		const bus = new DomainEventBus();
		const testDomainEventHandler = TestDomainEventHandler.create(bus);

		expect(testDomainEventHandler.isSubscribed).toBe(true);
		expect(testDomainEventHandler.handled).toHaveLength(0);

		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();

		await bus.dispatchAll(aggregate.pullDomainEvents());

		expect(testDomainEventHandler.isSubscribed).toBe(false);
		expect(testDomainEventHandler.handled).toHaveLength(1);
		expect(testDomainEventHandler.handled).toEqual([domainEvent]);
	});
});
