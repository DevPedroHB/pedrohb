import { defaultDomainEventBus } from "./default-domain-event-bus.js";

describe("defaultDomainEventBus", () => {
	it("should cache both dispatch modes on globalThis", () => {
		const globalForDomainEvents = globalThis as typeof globalThis & {
			defaultDomainEventBus?: typeof defaultDomainEventBus;
		};

		expect(globalForDomainEvents.defaultDomainEventBus).toBe(
			defaultDomainEventBus,
		);
		expect(defaultDomainEventBus.parallel).not.toBe(
			defaultDomainEventBus.serial,
		);
	});
});
