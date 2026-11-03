import {
	MAX,
	NIL,
	parse,
	stringify,
	type Version7Options,
	v7,
	validate,
	version,
} from "uuid";
import { EntityId } from "./entity-id.js";

export const UUID_MAX = MAX;
export const UUID_NIL = NIL;

export class UUID extends EntityId {
	private constructor(id: string) {
		super(id);
	}

	public toJSON() {
		return {
			id: this.id,
		};
	}

	public static isValid(uuid: unknown) {
		return validate(uuid);
	}

	public static parse(uuid: string) {
		return parse(uuid);
	}

	public static stringify(arr: Uint8Array, offset?: number) {
		return stringify(arr, offset);
	}

	public static generate(
		options?: Version7Options,
		buf?: undefined,
		offset?: number,
	) {
		return v7(options, buf, offset);
	}

	public static version(uuid: string) {
		return version(uuid);
	}

	public static create(uuid = UUID.generate()) {
		return new UUID(uuid);
	}
}
