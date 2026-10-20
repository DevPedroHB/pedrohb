import { TestDomainEventHandler } from "#test/test-domain-event-handler.js";
import { DomainEventBus } from "./domain-event-bus.js";
import { DomainEventHandlerGroup } from "./domain-event-handler-group.js";

let domainEventBus: DomainEventBus;
let testDomainEventHandler: TestDomainEventHandler;
let otherTestDomainEventHandler: TestDomainEventHandler;
let domainEventHandlerGroup: DomainEventHandlerGroup;

describe("DomainEventHandlerGroup", () => {
	beforeEach(() => {
		domainEventBus = new DomainEventBus({ dispatchMode: "parallel" });
		testDomainEventHandler = new TestDomainEventHandler(domainEventBus);
		otherTestDomainEventHandler = new TestDomainEventHandler(domainEventBus);
		domainEventHandlerGroup = new DomainEventHandlerGroup([
			testDomainEventHandler,
			otherTestDomainEventHandler,
		]);
	});

	it("should add and subscribe handlers", () => {
		otherTestDomainEventHandler.unsubscribe();

		const group = new DomainEventHandlerGroup([testDomainEventHandler]);

		expect(testDomainEventHandler.isSubscribed).toBe(true);
		expect(otherTestDomainEventHandler.isSubscribed).toBe(false);

		const added = group.add(otherTestDomainEventHandler);

		expect(added).toBe(otherTestDomainEventHandler);
		expect(otherTestDomainEventHandler.isSubscribed).toBe(true);
	});

	it("should subscribe all handlers", () => {
		testDomainEventHandler.unsubscribe();
		otherTestDomainEventHandler.unsubscribe();

		expect(testDomainEventHandler.isSubscribed).toBe(false);
		expect(otherTestDomainEventHandler.isSubscribed).toBe(false);

		domainEventHandlerGroup.subscribeAll();

		expect(testDomainEventHandler.isSubscribed).toBe(true);
		expect(otherTestDomainEventHandler.isSubscribed).toBe(true);
	});

	it("should skip disposed handlers when subscribing all", () => {
		testDomainEventHandler.dispose();

		expect(() => domainEventHandlerGroup.subscribeAll()).not.toThrow();
		expect(testDomainEventHandler.isSubscribed).toBe(false);
		expect(otherTestDomainEventHandler.isSubscribed).toBe(true);
	});

	it("should unsubscribe all handlers", () => {
		domainEventHandlerGroup.unsubscribeAll();

		expect(testDomainEventHandler.isSubscribed).toBe(false);
		expect(otherTestDomainEventHandler.isSubscribed).toBe(false);
	});

	it("should dispose all handlers", () => {
		domainEventHandlerGroup.disposeAll();

		expect(testDomainEventHandler.isDisposed).toBe(true);
		expect(testDomainEventHandler.isSubscribed).toBe(false);
		expect(otherTestDomainEventHandler.isDisposed).toBe(true);
		expect(otherTestDomainEventHandler.isSubscribed).toBe(false);
	});

	it.each(["unsubscribeAll", "disposeAll"] as const)(
		"should continue %s when a handler has already been disposed",
		(operation) => {
			testDomainEventHandler.dispose();

			expect(() => domainEventHandlerGroup[operation]()).not.toThrow();
			expect(otherTestDomainEventHandler.isSubscribed).toBe(false);

			if (operation === "disposeAll") {
				expect(otherTestDomainEventHandler.isDisposed).toBe(true);
			}
		},
	);
});
