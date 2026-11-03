import {
	customAlphabet,
	customRandom,
	nanoid,
	random,
	urlAlphabet,
} from "nanoid";
import { EntityId } from "./entity-id.js";

export const NANOID_URL_ALPHABET = urlAlphabet;

export class NanoID extends EntityId {
	private constructor(id: string) {
		super(id);
	}

	public toJSON() {
		return {
			id: this.id,
		};
	}

	public isValid(id: string) {
		return (
			id.length > 0 &&
			[...id].every((character) => urlAlphabet.includes(character))
		);
	}

	public static customAlphabet(alphabet: string, defaultSize?: number) {
		return customAlphabet(alphabet, defaultSize);
	}

	public static customRandom(
		alphabet: string,
		defaultSize: number,
		random: (bytes: number) => Uint8Array,
	) {
		return customRandom(alphabet, defaultSize, random);
	}

	public static generate(size?: number) {
		return nanoid(size);
	}

	public static random(bytes: number) {
		return random(bytes);
	}

	public static create(nanoid = NanoID.generate()) {
		return new NanoID(nanoid);
	}
}
