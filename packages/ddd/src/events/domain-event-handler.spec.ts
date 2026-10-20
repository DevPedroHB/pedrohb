import { DDDError } from "#/errors/ddd-error.js";
import { makeTestAggregate } from "#test/factories/make-test-aggregate.js";
import { TestDomainEventHandler } from "#test/test-domain-event-handler.js";
import { DomainEventBus } from "./domain-event-bus.js";

let domainEventBus: DomainEventBus;
let testDomainEventHandler: TestDomainEventHandler;

describe("DomainEventHandler", () => {
	beforeEach(() => {
		domainEventBus = new DomainEventBus();
		testDomainEventHandler = new TestDomainEventHandler(domainEventBus);
	});

	it("should handle dispatched domain events", async () => {
		expect(testDomainEventHandler.isSubscribed).toBe(true);
		expect(testDomainEventHandler.handled).toHaveLength(0);

		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();

		await domainEventBus.dispatchAll(aggregate.pullDomainEvents());

		expect(testDomainEventHandler.isSubscribed).toBe(false);
		expect(testDomainEventHandler.handled).toHaveLength(1);
		expect(testDomainEventHandler.handled).toEqual([domainEvent]);
	});

	it("should unsubscribe on dispose and throw a DDDError when subscribing after disposal", () => {
		expect(testDomainEventHandler.isDisposed).toBe(false);

		testDomainEventHandler.dispose();

		expect(testDomainEventHandler.isDisposed).toBe(true);
		expect(testDomainEventHandler.isSubscribed).toBe(false);

		const subscribe = () => testDomainEventHandler.subscribe();

		expect(subscribe).toThrow(DDDError);
		expect(subscribe).toThrow(
			expect.objectContaining({ code: "HANDLER_DISPOSED" }),
		);
	});

	it("should ignore unsubscribing when not subscribed and unsubscribe via the returned callback", () => {
		testDomainEventHandler.unsubscribe();

		expect(testDomainEventHandler.isSubscribed).toBe(false);

		testDomainEventHandler.unsubscribe();

		expect(testDomainEventHandler.isSubscribed).toBe(false);

		const unsubscribe = testDomainEventHandler.subscribe();

		expect(testDomainEventHandler.isSubscribed).toBe(true);

		unsubscribe();

		expect(testDomainEventHandler.isSubscribed).toBe(false);
	});
});
