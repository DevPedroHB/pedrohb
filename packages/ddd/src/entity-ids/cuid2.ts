import { createId, getConstants, init, isCuid } from "@paralleldrive/cuid2";
import { EntityId } from "./entity-id.js";

export const {
	bigLength: CUID2_BIG_LENGTH,
	defaultLength: CUID2_DEFAULT_LENGTH,
} = getConstants();

export class CUID2 extends EntityId {
	private constructor(id: string) {
		super(id);
	}

	public toJSON() {
		return {
			id: this.id,
		};
	}

	public static isValid(
		id: string,
		options?: {
			minLength?: number;
			maxLength?: number;
		},
	) {
		return isCuid(id, options);
	}

	public static generate() {
		return createId();
	}

	public static init(options?: {
		random?: () => number;
		counter?: () => number;
		length?: number;
		fingerprint?: string;
	}) {
		return init(options);
	}

	public static create(cuid2 = CUID2.generate()) {
		return new CUID2(cuid2);
	}
}
