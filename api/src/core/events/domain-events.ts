import type { AggregateRoot } from "../entities/aggregate-root";
import type { UniqueEntityID } from "../entities/unique-entity-id";
import type { DomainEvent } from "./domain-event";

type DomainEventCallback<T extends DomainEvent> = (event: T) => void;

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class DomainEvents {
	private static handlersMap: Record<
		string,
		DomainEventCallback<DomainEvent>[]
	> = {};
	private static markedAggregates: AggregateRoot<unknown>[] = [];
	public static shouldRun = true;

	public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
		const aggregateFound = !!DomainEvents.findMarkedAggregateByID(aggregate.id);

		if (!aggregateFound) {
			DomainEvents.markedAggregates.push(aggregate);
		}
	}

	private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
		for (let i = 0; i < aggregate.domainEvents.length; i++) {
			DomainEvents.dispatch(aggregate.domainEvents[i]);
		}
	}

	private static removeAggregateFromMarkedDispatchList(
		aggregate: AggregateRoot<unknown>,
	) {
		const index = DomainEvents.markedAggregates.findIndex((a) =>
			DomainEvents.isSameAggregate(a, aggregate),
		);
		DomainEvents.markedAggregates.splice(index, 1);
	}

	private static isSameAggregate(
		aggregate1: AggregateRoot<unknown>,
		aggregate2: AggregateRoot<unknown>,
	): boolean {
		return aggregate1.equals(aggregate2);
	}

	private static findMarkedAggregateByID(
		id: UniqueEntityID,
	): AggregateRoot<unknown> | undefined {
		return DomainEvents.markedAggregates.find((aggregate) =>
			aggregate.id.equals(id),
		);
	}

	public static dispatchEventsForAggregate(id: UniqueEntityID) {
		const aggregate = DomainEvents.findMarkedAggregateByID(id);

		if (aggregate) {
			DomainEvents.dispatchAggregateEvents(aggregate);

			aggregate.clearEvents();

			DomainEvents.removeAggregateFromMarkedDispatchList(aggregate);
		}
	}

	public static register(
		callback: DomainEventCallback<DomainEvent>,
		eventClassName: string,
	) {
		const wasEventRegisteredBefore = eventClassName in DomainEvents.handlersMap;

		if (!wasEventRegisteredBefore) {
			DomainEvents.handlersMap[eventClassName] = [];
		}

		DomainEvents.handlersMap[eventClassName].push(callback);
	}

	public static clearHandlers() {
		DomainEvents.handlersMap = {};
	}

	public static clearMarkedAggregates() {
		DomainEvents.markedAggregates = [];
	}

	private static async dispatch(event: DomainEvent) {
		const eventClassName: string = event.constructor.name;
		const isEventRegistered = eventClassName in DomainEvents.handlersMap;

		if (!DomainEvents.shouldRun) {
			return;
		}

		if (isEventRegistered) {
			const handlers = DomainEvents.handlersMap[eventClassName];

			for (const handler of handlers) {
				try {
					handler(event);
				} catch (error) {
					console.error(`Error dispatching event: ${eventClassName}`, error);
				}
			}
		}
	}
}
