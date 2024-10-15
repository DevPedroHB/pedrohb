import { randomUUID } from "node:crypto";

export class UniqueEntityID {
	private readonly _id: string;

	constructor(id?: string) {
		this._id = id ?? randomUUID();
	}

	get id(): string {
		return this._id;
	}

	public equals(id: UniqueEntityID): boolean {
		return id.id === this.id;
	}
}
