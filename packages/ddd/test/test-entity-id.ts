import { type Version7Options, v7, validate } from "uuid";
import { EntityId } from "#/index.js";

export class TestEntityId extends EntityId {
	protected constructor(id: string) {
		super(id);
	}

	public toJSON() {
		return {
			id: this.id,
		};
	}

	public isValid(testEntityId: unknown) {
		return validate(testEntityId);
	}

	public static generate(
		options?: Version7Options,
		buf?: undefined,
		offset?: number,
	): string {
		return v7(options, buf, offset);
	}

	public static create(id = TestEntityId.generate()) {
		return new TestEntityId(id);
	}
}
