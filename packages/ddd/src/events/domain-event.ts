import type { EntityId } from "#/entity-ids/entity-id.js";
import { UUID } from "#/entity-ids/uuid.js";

export type DomainEventOptions<
	Data extends object,
	Id extends EntityId = EntityId,
> = {
	data: Data;
	id?: Id;
	occurredAt?: Date;
};

export abstract class DomainEvent<
	Data extends object = object,
	Id extends EntityId = EntityId,
> {
	public static readonly type: string;
	public readonly id: Id;
	public readonly data: Readonly<Data>;
	public readonly occurredAt: Date;

	public get type(): string {
		return (this.constructor as unknown as { type: string }).type;
	}

	public constructor({
		data,
		occurredAt = new Date(),
		id = UUID.create() as Id,
	}: DomainEventOptions<Data, Id>) {
		this.id = id;
		this.data = data;
		this.occurredAt = occurredAt;
	}

	public abstract toJSON(): object;
}
