import { UniqueEntityID } from "./unique-entity-id";

export abstract class Entity<T> {
	private readonly _id: UniqueEntityID;
	protected readonly props: T;

	protected constructor(props: T, id?: UniqueEntityID) {
		this._id = id ?? new UniqueEntityID();
		this.props = props;
	}

	get id(): UniqueEntityID {
		return this._id;
	}

	public equals(entity?: Entity<unknown>): boolean {
		if (entity === null || entity === undefined) {
			return false;
		}

		if (!(entity instanceof Entity)) {
			return false;
		}

		return this.id.equals(entity.id);
	}
}
