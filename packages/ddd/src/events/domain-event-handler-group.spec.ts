import { TestDomainEventHandler } from "#test/test-domain-event-handler.js";
import { DomainEventBus } from "./domain-event-bus.js";
import { DomainEventHandlerGroup } from "./domain-event-handler-group.js";

describe("DomainEventHandlerGroup", () => {
	it("should add and subscribe handlers", () => {
		const bus = new DomainEventBus();
		const handler = new TestDomainEventHandler(bus);
		const otherHandler = new TestDomainEventHandler(bus);

		otherHandler.unsubscribe();

		const group = new DomainEventHandlerGroup([handler]);

		expect(handler.isSubscribed).toBe(true);
		expect(otherHandler.isSubscribed).toBe(false);

		const added = group.add(otherHandler);

		expect(added).toBe(otherHandler);
		expect(otherHandler.isSubscribed).toBe(true);
	});

	it("should subscribe all handlers", () => {
		const bus = new DomainEventBus();
		const handler = new TestDomainEventHandler(bus);
		const otherHandler = new TestDomainEventHandler(bus);
		const group = new DomainEventHandlerGroup([handler, otherHandler]);

		handler.unsubscribe();
		otherHandler.unsubscribe();

		expect(handler.isSubscribed).toBe(false);
		expect(otherHandler.isSubscribed).toBe(false);

		group.subscribeAll();

		expect(handler.isSubscribed).toBe(true);
		expect(otherHandler.isSubscribed).toBe(true);
	});

	it("should continue subscribing when a handler has already been disposed", () => {
		const bus = new DomainEventBus();
		const disposedHandler = new TestDomainEventHandler(bus);
		const activeHandler = new TestDomainEventHandler(bus);
		const group = new DomainEventHandlerGroup([disposedHandler, activeHandler]);

		disposedHandler.dispose();

		expect(() => group.subscribeAll()).not.toThrow();
		expect(activeHandler.isSubscribed).toBe(true);
	});

	it("should unsubscribe all handlers", () => {
		const bus = new DomainEventBus();
		const handler = new TestDomainEventHandler(bus);
		const otherHandler = new TestDomainEventHandler(bus);
		const group = new DomainEventHandlerGroup([handler, otherHandler]);

		group.unsubscribeAll();

		expect(handler.isSubscribed).toBe(false);
		expect(otherHandler.isSubscribed).toBe(false);
	});

	it("should dispose all handlers", () => {
		const bus = new DomainEventBus();
		const handler = new TestDomainEventHandler(bus);
		const otherHandler = new TestDomainEventHandler(bus);
		const group = new DomainEventHandlerGroup([handler, otherHandler]);

		group.disposeAll();

		expect(handler.isDisposed).toBe(true);
		expect(handler.isSubscribed).toBe(false);
		expect(otherHandler.isDisposed).toBe(true);
		expect(otherHandler.isSubscribed).toBe(false);
	});
});
