import { DDDError } from "#/errors/ddd-error.js";
import { sleep } from "#/functions/sleep.js";
import { makeTestAggregate } from "#test/factories/make-test-aggregate.js";
import type { TestAggregate } from "#test/test-aggregate.js";
import { TestDomainEvent } from "#test/test-domain-event.js";
import type { TestEntityId } from "#test/test-entity-id.js";
import { DomainEvent } from "./domain-event.js";
import {
	DomainEventBus,
	type DomainEventListener,
} from "./domain-event-bus.js";

let busParallel: DomainEventBus;
let busSerial: DomainEventBus;

describe("DomainEventBus", () => {
	beforeEach(() => {
		busParallel = new DomainEventBus({ dispatchMode: "parallel" });
		busSerial = new DomainEventBus({ dispatchMode: "serial" });
	});

	class OtherDomainEvent extends DomainEvent<
		ReturnType<TestAggregate["toJSON"]>,
		TestEntityId
	> {
		public toJSON() {
			return {
				id: this.id.toJSON().id,
				data: this.data,
				occurredAt: this.occurredAt.toISOString(),
			};
		}
	}

	it("should register and unregister listeners for a domain event class", () => {
		const listener = vi.fn();

		expect(busParallel.isHandlerSubscribed(TestDomainEvent, listener)).toBe(
			false,
		);

		const unregister = busParallel.register(TestDomainEvent, listener);

		expect(busParallel.isHandlerSubscribed(TestDomainEvent, listener)).toBe(
			true,
		);

		unregister();

		expect(busParallel.isHandlerSubscribed(TestDomainEvent, listener)).toBe(
			false,
		);
	});

	it("should ignore unregistering listeners that were not registered", () => {
		const listener = vi.fn();

		expect(() =>
			busParallel.unregister(TestDomainEvent, listener),
		).not.toThrow();
	});

	it("should dispatch the domain event to its registered listeners", async () => {
		const listener = vi.fn();
		const otherListener = vi.fn();

		busParallel.register(TestDomainEvent, listener);
		busParallel.register(OtherDomainEvent, otherListener);

		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();

		await busParallel.dispatch(domainEvent);

		expect(listener).toHaveBeenCalledWith(domainEvent);
		expect(otherListener).not.toHaveBeenCalled();
	});

	it("should type handlers for events with custom constructors", () => {
		const listener: DomainEventListener<TestDomainEvent> = (event) => {
			expectTypeOf(event).toEqualTypeOf<TestDomainEvent>();
		};

		busParallel.register(TestDomainEvent, listener);
	});

	it("should not dispatch subclass events to a base-class handler", async () => {
		class DerivedDomainEvent extends TestDomainEvent {}

		const listener = vi.fn();

		busParallel.register(TestDomainEvent, listener);

		const { aggregate } = makeTestAggregate();

		await busParallel.dispatch(new DerivedDomainEvent(aggregate));

		expect(listener).not.toHaveBeenCalled();
	});

	it("should not throw when dispatching a domain event without listeners", async () => {
		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();

		await expect(busParallel.dispatch(domainEvent)).resolves.toBeUndefined();
	});

	it("should throw a DDDError when a listener fails but still call the other listeners", async () => {
		const failingListener = vi.fn().mockRejectedValue(new Error("boom"));
		const listener = vi.fn().mockResolvedValue(undefined);

		busParallel.register(TestDomainEvent, failingListener);
		busParallel.register(TestDomainEvent, listener);

		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();
		const dispatch = busParallel.dispatch(domainEvent);

		await expect(dispatch).rejects.toThrow(DDDError);
		await expect(dispatch).rejects.toThrow(
			expect.objectContaining({ code: "DOMAIN_EVENT_DISPATCH_FAILED" }),
		);
		expect(listener).toHaveBeenCalledWith(domainEvent);
	});

	it("should dispatch every domain event to its registered listeners", async () => {
		const listener = vi.fn();

		busParallel.register(TestDomainEvent, listener);

		const { aggregate } = makeTestAggregate();
		const event1 = aggregate.addNewDomainEvent();
		const event2 = aggregate.addNewDomainEvent();

		await busParallel.dispatchAll(aggregate.pullDomainEvents());

		expect(listener).toHaveBeenCalledTimes(2);
		expect(listener).toHaveBeenNthCalledWith(1, event1);
		expect(listener).toHaveBeenNthCalledWith(2, event2);
	});

	it("should throw a DDDError when dispatching events whose listeners fail", async () => {
		const failingListener = vi.fn().mockRejectedValue(new Error("boom"));

		busParallel.register(TestDomainEvent, failingListener);

		const { aggregate } = makeTestAggregate();

		aggregate.addNewDomainEvent();
		aggregate.addNewDomainEvent();

		const dispatchAll = busParallel.dispatchAll(aggregate.pullDomainEvents());

		await expect(dispatchAll).rejects.toThrow(DDDError);
		await expect(dispatchAll).rejects.toThrow(
			expect.objectContaining({ code: "DOMAIN_EVENTS_DISPATCH_FAILED" }),
		);
	});

	it("should run listeners concurrently in parallel mode without guaranteeing completion order", async () => {
		const started: Array<() => void> = [];
		const completed: string[] = [];
		const startSignals = [0, 1].map(
			() => new Promise<void>((resolve) => started.push(resolve)),
		);
		const releases: Array<() => void> = [];
		const gates = [0, 1].map(
			() => new Promise<void>((resolve) => releases.push(resolve)),
		);

		for (const index of [0, 1]) {
			busParallel.register(TestDomainEvent, async () => {
				started[index]();

				await gates[index];

				completed.push(`listener-${index}`);
			});
		}

		const { aggregate } = makeTestAggregate();
		const dispatch = busParallel.dispatch(aggregate.addNewDomainEvent());

		await Promise.all(startSignals);

		releases[1]();
		releases[0]();

		await dispatch;

		expect(completed).toEqual(["listener-1", "listener-0"]);
	});

	it("should clear all registered listeners", () => {
		const listener = vi.fn();

		busParallel.register(TestDomainEvent, listener);

		busParallel.clearHandlers();

		expect(busParallel.isHandlerSubscribed(TestDomainEvent, listener)).toBe(
			false,
		);
	});

	it("should run listeners in order in serial mode and still call the next listener after a failure", async () => {
		const calls: string[] = [];
		const failingListener = vi.fn(() => {
			calls.push("failing");

			return Promise.reject(new Error("boom"));
		});
		const listener = vi.fn(() => {
			calls.push("listener");
		});

		busSerial.register(TestDomainEvent, failingListener);
		busSerial.register(TestDomainEvent, listener);

		const { aggregate } = makeTestAggregate();
		const domainEvent = aggregate.addNewDomainEvent();
		const dispatch = busSerial.dispatch(domainEvent);

		await expect(dispatch).rejects.toThrow(
			expect.objectContaining({ code: "DOMAIN_EVENT_DISPATCH_FAILED" }),
		);
		expect(calls).toEqual(["failing", "listener"]);
	});

	it("should dispatch domain events one at a time in serial mode", async () => {
		const calls: string[] = [];
		const listener = vi.fn(async () => {
			calls.push("start");

			await sleep(0.01);

			calls.push("end");
		});

		busSerial.register(TestDomainEvent, listener);

		const { aggregate } = makeTestAggregate();

		aggregate.addNewDomainEvent();
		aggregate.addNewDomainEvent();

		await busSerial.dispatchAll(aggregate.pullDomainEvents());

		expect(calls).toEqual(["start", "end", "start", "end"]);
	});

	it("should dispatch events concurrently in parallel mode without guaranteeing completion order", async () => {
		const started: Array<() => void> = [];
		const completed: DomainEvent[] = [];
		const startSignals = [0, 1].map(
			() => new Promise<void>((resolve) => started.push(resolve)),
		);
		const releases: Array<() => void> = [];
		const gates = [0, 1].map(
			() => new Promise<void>((resolve) => releases.push(resolve)),
		);
		let eventIndex = 0;

		busParallel.register(TestDomainEvent, async (event) => {
			const index = eventIndex++;

			started[index]();

			await gates[index];

			completed.push(event);
		});

		const { aggregate } = makeTestAggregate();
		const firstEvent = aggregate.addNewDomainEvent();
		const secondEvent = aggregate.addNewDomainEvent();
		const dispatch = busParallel.dispatchAll([firstEvent, secondEvent]);

		await Promise.all(startSignals);

		releases[1]();
		releases[0]();

		await dispatch;

		expect(completed).toEqual([secondEvent, firstEvent]);
	});

	it("should throw a DDDError when dispatching events whose listeners fail in serial mode", async () => {
		const failingListener = vi.fn().mockRejectedValue(new Error("boom"));

		busSerial.register(TestDomainEvent, failingListener);

		const { aggregate } = makeTestAggregate();

		aggregate.addNewDomainEvent();
		aggregate.addNewDomainEvent();

		const dispatchAll = busSerial.dispatchAll(aggregate.pullDomainEvents());

		await expect(dispatchAll).rejects.toThrow(DDDError);
		await expect(dispatchAll).rejects.toThrow(
			expect.objectContaining({ code: "DOMAIN_EVENTS_DISPATCH_FAILED" }),
		);
	});
});
