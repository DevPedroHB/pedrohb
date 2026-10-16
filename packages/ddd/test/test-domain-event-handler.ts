import {
	domainEventBus as bus,
	type DomainEventBus,
	type DomainEventClass,
	DomainEventHandler,
} from "#/index.js";
import { TestDomainEvent } from "./test-domain-event.js";

export class TestDomainEventHandler extends DomainEventHandler<TestDomainEvent> {
	protected readonly domainEvent: DomainEventClass<TestDomainEvent> =
		TestDomainEvent;
	public readonly handled: TestDomainEvent[] = [];

	public constructor(domainEventBus: DomainEventBus = bus) {
		super(domainEventBus);

		this.subscribe();
	}

	public async handle(domainEvent: TestDomainEvent) {
		await this.handled.push(domainEvent);

		this.unsubscribe();
	}

	public static create(domainEventBus: DomainEventBus = bus) {
		return new TestDomainEventHandler(domainEventBus);
	}
}
