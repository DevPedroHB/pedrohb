import { Aggregate } from "#/entities/aggregate.js";
import type { Entity } from "#/entities/entity.js";
import type { EntityId } from "#/entity-ids/entity-id.js";
import { DDDError } from "#/errors/ddd-error.js";
import type { DomainEvent } from "#/events/domain-event.js";
import type { DomainEventBus } from "#/events/domain-event-bus.js";
import { buildPage, resolvePagination } from "#/functions/pagination.js";
import { sortEntities } from "#/functions/sort-entities.js";
import { toCriteria } from "#/functions/to-criteria.js";
import { type FindAllOptions, type Page, Repository } from "./repository.js";

function keyOf(id: EntityId, prefix?: string) {
	let key = `${id.constructor.name}:${String(id.id)}`;

	if (prefix) {
		key = `${prefix}:${key}`;
	}

	return key;
}

export type InMemoryOutboxEntry = {
	event: DomainEvent;
	dispatched: boolean;
};

export class InMemoryRepository<
	E extends Entity | Aggregate = Entity,
> extends Repository<E> {
	public readonly store = new Map<string, E>();
	public readonly outbox = new Map<string, InMemoryOutboxEntry>();

	public constructor(private readonly domainEventBus: DomainEventBus) {
		super();
	}

	protected async publishEvents(entity: E): Promise<void> {
		if (!(entity instanceof Aggregate)) {
			return;
		}

		const events = entity.events;

		if (events.length === 0) {
			return;
		}

		for (const event of events) {
			const key = keyOf(event.id, event.constructor.name);

			if (!this.outbox.has(key)) {
				this.outbox.set(key, { event, dispatched: false });
			}
		}

		const pending = events.filter(
			(event) =>
				!this.outbox.get(keyOf(event.id, event.constructor.name))?.dispatched,
		);

		if (pending.length === 0) {
			entity.clearDomainEvents(events);

			return;
		}

		await this.domainEventBus.dispatchAll(pending);

		for (const event of pending) {
			const entry = this.outbox.get(keyOf(event.id, event.constructor.name));

			if (entry) {
				entry.dispatched = true;
			}
		}

		entity.clearDomainEvents(events);
	}

	public async findAll(options: FindAllOptions<E> = {}): Promise<Page<E>> {
		const pagination = resolvePagination(options);
		const { offset, perPage } = pagination;
		const criteria = toCriteria(options.orderBy ?? {});
		const total = this.store.size;

		if (criteria.length === 0) {
			const items: E[] = [];
			let index = 0;

			for (const entity of this.store.values()) {
				if (index >= offset + perPage) {
					break;
				}

				if (index >= offset) {
					items.push(entity);
				}

				index++;
			}

			return buildPage(items, total, pagination);
		}

		const sorted = sortEntities(Array.from(this.store.values()), criteria);

		return buildPage(sorted.slice(offset, offset + perPage), total, pagination);
	}

	public async findById(key: E["id"]): Promise<E | null> {
		return this.store.get(keyOf(key)) ?? null;
	}

	public async create(entity: E): Promise<void> {
		const key = keyOf(entity.id);

		if (this.store.has(key)) {
			throw new DDDError("ITEM_ALREADY_EXISTS", {
				params: {
					field: "id",
					value: String(entity.id.id),
				},
				cause: this.store.get(key),
			});
		}

		this.store.set(key, entity);

		await this.publishEvents(entity);
	}

	public async update(entity: E): Promise<void> {
		const key = keyOf(entity.id);

		if (!this.store.has(key)) {
			throw new DDDError("ITEM_NOT_FOUND", {
				params: {
					field: "id",
					value: String(entity.id.id),
				},
				cause: entity.id,
			});
		}

		this.store.set(key, entity);

		await this.publishEvents(entity);
	}

	public async delete(entity: E): Promise<void> {
		const key = keyOf(entity.id);

		if (!this.store.has(key)) {
			throw new DDDError("ITEM_NOT_FOUND", {
				params: {
					field: "id",
					value: String(entity.id.id),
				},
				cause: entity.id,
			});
		}

		this.store.delete(key);

		await this.publishEvents(entity);
	}
}
