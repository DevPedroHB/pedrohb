import {
	decodeTime,
	encodeTime,
	fixULIDBase32,
	incrementBase32,
	isValid,
	MAX_ULID,
	MIN_ULID,
	monotonicFactory,
	type PRNG,
	TIME_LEN,
	TIME_MAX,
	ulid,
	ulidToUUID,
	uuidToULID,
} from "ulid";
import { EntityId } from "./entity-id.js";

export const ULID_MAX = MAX_ULID;
export const ULID_MIN = MIN_ULID;
export const ULID_TIME_LEN = TIME_LEN;
export const ULID_TIME_MAX = TIME_MAX;

export class ULID extends EntityId {
	private constructor(id: string) {
		super(id);
	}

	public toJSON() {
		return {
			id: this.id,
		};
	}

	public isValid(id: string) {
		return ULID.isValid(id);
	}

	public static decodeTime(id: string) {
		return decodeTime(id);
	}

	public static encodeTime(now: number, len?: number) {
		return encodeTime(now, len);
	}

	public static fixULIDBase32(id: string) {
		return fixULIDBase32(id);
	}

	public static incrementBase32(str: string) {
		return incrementBase32(str);
	}

	public static isValid(id: string) {
		return isValid(id);
	}

	public static monotonicFactory(prng?: PRNG) {
		return monotonicFactory(prng);
	}

	public static generate(seedTime?: number, prng?: PRNG) {
		return ulid(seedTime, prng);
	}

	public static ulidToUUID(ulid: string) {
		return ulidToUUID(ulid);
	}

	public static uuidToULID(uuid: string) {
		return uuidToULID(uuid);
	}

	public static create(ulid = ULID.generate()) {
		return new ULID(ulid);
	}
}
