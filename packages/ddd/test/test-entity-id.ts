import { randomUUIDv7 } from "node:crypto";
import { EntityId } from "#/index.js";

export class TestEntityId extends EntityId {
	public toJSON() {
		return {
			id: this.id,
		};
	}

	public isValid(id: string) {
		return typeof id === "string";
	}

	public static generate(): string {
		return randomUUIDv7();
	}

	public static create(id = TestEntityId.generate()) {
		return new TestEntityId(id);
	}
}
