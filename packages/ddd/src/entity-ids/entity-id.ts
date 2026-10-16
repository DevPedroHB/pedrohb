import { DDDError } from "#/errors/ddd-error.js";

export type EntityIdType = string | number | bigint;

export abstract class EntityId<Id extends EntityIdType = string> {
	public readonly id: Id;

	public constructor(id: Id) {
		if (!this.isValid(id)) {
			throw new DDDError("INVALID_ENTITY_ID", {
				params: { id: String(id) },
				cause: id,
			});
		}

		this.id = id;
	}

	public equals(entityId: EntityId<Id>) {
		if (this === entityId) {
			return true;
		}

		if (this.constructor !== entityId.constructor) {
			return false;
		}

		return this.id === entityId.id;
	}

	public abstract toJSON(): object;

	public abstract isValid(id: Id): boolean;
}
