import { DDDError } from "#/errors/ddd-error.js";
import { makeTestAggregate } from "#test/factories/make-test-aggregate.js";
import type { TestAggregate } from "#test/test-aggregate.js";
import { TestDomainEvent } from "#test/test-domain-event.js";
import { DomainEvent } from "./domain-event.js";
import { DomainEventBus } from "./domain-event-bus.js";

describe("DomainEventBus", () => {
	class OtherDomainEvent extends DomainEvent<TestAggregate> {}

	it("should register and unregister listeners for a domain event class", () => {
		const bus = new DomainEventBus();
		const listener = vi.fn();

		expect(bus.isHandlerSubscribed(TestDomainEvent, listener)).toBe(false);

		const unregister = bus.register(TestDomainEvent, listener);

		expect(bus.isHandlerSubscribed(TestDomainEvent, listener)).toBe(true);

		unregister();

		expect(bus.isHandlerSubscribed(TestDomainEvent, listener)).toBe(false);
	});

	it("should ignore unregistering listeners that were not registered", () => {
		const bus = new DomainEventBus();
		const listener = vi.fn();

		expect(() => bus.unregister(TestDomainEvent, listener)).not.toThrow();
	});

	it("should dispatch the domain event to its registered listeners", async () => {
		const bus = new DomainEventBus();
		const listener = vi.fn();
		const otherListener = vi.fn();

		bus.register(TestDomainEvent, listener);
		bus.register(OtherDomainEvent, otherListener);

		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();

		await bus.dispatch(domainEvent);

		expect(listener).toHaveBeenCalledWith(domainEvent);
		expect(otherListener).not.toHaveBeenCalled();
	});

	it("should not throw when dispatching a domain event without listeners", async () => {
		const bus = new DomainEventBus();
		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();

		await expect(bus.dispatch(domainEvent)).resolves.toBeUndefined();
	});

	it("should throw a DDDError when a listener fails but still call the other listeners", async () => {
		const bus = new DomainEventBus();
		const failingListener = vi.fn().mockRejectedValue(new Error("boom"));
		const listener = vi.fn().mockResolvedValue(undefined);

		bus.register(TestDomainEvent, failingListener);
		bus.register(TestDomainEvent, listener);

		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();
		const dispatch = bus.dispatch(domainEvent);

		await expect(dispatch).rejects.toThrow(DDDError);
		await expect(dispatch).rejects.toThrow(
			expect.objectContaining({ code: "DOMAIN_EVENT_DISPATCH_FAILED" }),
		);
		expect(listener).toHaveBeenCalledWith(domainEvent);
	});

	it("should dispatch every domain event to its registered listeners", async () => {
		const bus = new DomainEventBus();
		const listener = vi.fn();

		bus.register(TestDomainEvent, listener);

		const { aggregate } = makeTestAggregate();
		const event1 = aggregate.addNewDomainEvent();
		const event2 = aggregate.addNewDomainEvent();

		await bus.dispatchAll(aggregate.pullDomainEvents());

		expect(listener).toHaveBeenCalledTimes(2);
		expect(listener).toHaveBeenNthCalledWith(1, event1);
		expect(listener).toHaveBeenNthCalledWith(2, event2);
	});

	it("should throw a DDDError when dispatching events whose listeners fail", async () => {
		const bus = new DomainEventBus();
		const failingListener = vi.fn().mockRejectedValue(new Error("boom"));

		bus.register(TestDomainEvent, failingListener);

		const { aggregate } = makeTestAggregate();

		aggregate.addNewDomainEvent();
		aggregate.addNewDomainEvent();

		const dispatchAll = bus.dispatchAll(aggregate.pullDomainEvents());

		await expect(dispatchAll).rejects.toThrow(DDDError);
		await expect(dispatchAll).rejects.toThrow(
			expect.objectContaining({ code: "DOMAIN_EVENTS_DISPATCH_FAILED" }),
		);
	});

	it("should clear all registered listeners", () => {
		const bus = new DomainEventBus();
		const listener = vi.fn();

		bus.register(TestDomainEvent, listener);

		bus.clearHandlers();

		expect(bus.isHandlerSubscribed(TestDomainEvent, listener)).toBe(false);
	});
});
