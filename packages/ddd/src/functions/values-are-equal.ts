import { ValueObject } from "#/value-objects/value-object.js";
import { isPlainObject } from "./is-plain-object.js";

export function valuesAreEqual(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) {
		return true;
	}

	if (a instanceof ValueObject && b instanceof ValueObject) {
		return a.equals(b);
	}

	if (a instanceof Date && b instanceof Date) {
		return a.getTime() === b.getTime();
	}

	if (Array.isArray(a) && Array.isArray(b)) {
		return (
			a.length === b.length && a.every((item, i) => valuesAreEqual(item, b[i]))
		);
	}

	if (isPlainObject(a) && isPlainObject(b)) {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);

		return (
			keysA.length === keysB.length &&
			keysA.every(
				(key) => Object.hasOwn(b, key) && valuesAreEqual(a[key], b[key]),
			)
		);
	}

	return false;
}
