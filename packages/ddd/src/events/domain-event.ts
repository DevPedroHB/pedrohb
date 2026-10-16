import type { Aggregate } from "#/entities/aggregate.js";
import type { EntityId } from "#/entity-ids/entity-id.js";
import { UUID } from "#/entity-ids/uuid.js";

export abstract class DomainEvent<A extends Aggregate = Aggregate> {
	public readonly id: EntityId;
	public readonly aggregate: A;
	public readonly occurredAt: Date;

	public constructor(
		aggregate: A,
		occurredAt = new Date(),
		id: EntityId = UUID.create(),
	) {
		this.id = id;
		this.aggregate = aggregate;
		this.occurredAt = occurredAt;
	}
}
