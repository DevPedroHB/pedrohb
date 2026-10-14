import type { EntityId } from "#/entity-ids/entity-id.js";
import { Entity } from "./entity.js";

export type TimestampsEntity = {
	createdAt: Date;
	updatedAt: Date;
};

export abstract class TimestampedEntity<
	Id extends EntityId = EntityId,
	Props extends TimestampsEntity = TimestampsEntity,
> extends Entity<Id, Props> {
	public get createdAt() {
		return this.props.createdAt;
	}

	public get updatedAt() {
		return this.props.updatedAt;
	}

	protected touch(now = new Date()) {
		this.props.updatedAt = now;
	}
}

export function createTimestamps(now = new Date()): TimestampsEntity {
	return {
		createdAt: now,
		updatedAt: now,
	};
}
