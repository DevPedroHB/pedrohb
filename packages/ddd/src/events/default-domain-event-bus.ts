import { type DispatchMode, DomainEventBus } from "./domain-event-bus.js";

const globalForDomainEvents = globalThis as unknown as {
	defaultDomainEventBus?: Record<DispatchMode, DomainEventBus>;
};

const cachedDomainEventBus = globalForDomainEvents.defaultDomainEventBus;

export const defaultDomainEventBus = cachedDomainEventBus ?? {
	parallel: new DomainEventBus({ dispatchMode: "parallel" }),
	serial: new DomainEventBus({ dispatchMode: "serial" }),
};

if (!cachedDomainEventBus) {
	globalForDomainEvents.defaultDomainEventBus = defaultDomainEventBus;
}
