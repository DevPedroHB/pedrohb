import type { EntityId } from "#/entity-ids/entity-id.js";

export abstract class Entity<
	Id extends EntityId = EntityId,
	Props extends object = object,
> {
	public readonly id: Id;
	protected readonly props: Props;

	public constructor(id: Id, props: Props) {
		this.id = id;
		this.props = props;
	}

	public equals(entity: Entity<Id, Props>) {
		if (this === entity) {
			return true;
		}

		if (this.constructor !== entity.constructor) {
			return false;
		}

		return this.id.equals(entity.id);
	}

	public abstract toJSON(): object;
}
