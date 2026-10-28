import { Aggregate } from "#/entities/aggregate.js";
import { DDDError } from "#/errors/ddd-error.js";
import type { DomainEventBus } from "#/events/domain-event-bus.js";
import type { Repository } from "./repository.js";

export class InMemoryRepository<
	Value extends object = object,
	Key extends keyof Value & PropertyKey = keyof Value & PropertyKey,
> implements Repository<Value, Key>
{
	protected readonly items = new Map<Value[Key], Value>();

	public constructor(
		protected readonly domainEventBus: DomainEventBus,
		public readonly key: Key = "id" as Key,
	) {}

	public async findAll(): Promise<Value[]> {
		return [...this.items.values()];
	}

	public async findByKey(key: Value[Key]): Promise<Value | null> {
		return this.items.get(key) ?? null;
	}

	public async create(value: Value): Promise<void> {
		const key = value[this.key];

		if (this.items.has(key)) {
			throw new DDDError("ITEM_ALREADY_EXISTS", {
				params: {
					field: String(this.key),
					value: String(key),
				},
			});
		}

		this.items.set(key, value);

		await this.dispatchEvents(value);
	}

	public async update(value: Value): Promise<void> {
		const key = value[this.key];

		if (!this.items.has(key)) {
			throw this.notFound(key);
		}

		this.items.set(key, value);

		await this.dispatchEvents(value);
	}

	public async delete(value: Value): Promise<void> {
		const key = value[this.key];

		if (!this.items.has(key)) {
			throw this.notFound(key);
		}

		this.items.delete(key);

		await this.dispatchEvents(value);
	}

	public notFound(key: Value[Key]) {
		return new DDDError("ITEM_NOT_FOUND", {
			params: {
				field: String(this.key),
				value: String(key),
			},
		});
	}

	public async dispatchEvents(value: Value) {
		if (value instanceof Aggregate) {
			await this.domainEventBus.dispatchAll(value.pullDomainEvents());
		}
	}
}
