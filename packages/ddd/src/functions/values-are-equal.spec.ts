import { makeTestValueObject } from "#test/factories/make-test-value-object.js";
import { valuesAreEqual } from "./values-are-equal.js";

describe("valuesAreEqual", () => {
	it("should return true for identical primitives", () => {
		expect(valuesAreEqual(1, 1)).toBe(true);
		expect(valuesAreEqual("a", "a")).toBe(true);
		expect(valuesAreEqual(null, null)).toBe(true);
	});

	it("should return false for different primitives", () => {
		expect(valuesAreEqual(1, 2)).toBe(false);
		expect(valuesAreEqual("a", "b")).toBe(false);
		expect(valuesAreEqual(null, {})).toBe(false);
	});

	it("should compare value objects by props", () => {
		const { props, valueObject } = makeTestValueObject();

		expect(
			valuesAreEqual(valueObject, makeTestValueObject(props).valueObject),
		).toBe(true);
		expect(valuesAreEqual(valueObject, makeTestValueObject().valueObject)).toBe(
			false,
		);
	});

	it("should compare dates by time", () => {
		const time = new Date("2025-01-01");

		expect(valuesAreEqual(time, new Date("2025-01-01"))).toBe(true);
		expect(valuesAreEqual(time, new Date("2025-01-02"))).toBe(false);
	});

	it("should compare arrays deeply", () => {
		expect(
			valuesAreEqual(
				[1, "a", new Date("2025-01-01")],
				[1, "a", new Date("2025-01-01")],
			),
		).toBe(true);
		expect(valuesAreEqual([1, 2], [1, 3])).toBe(false);
		expect(valuesAreEqual([1], [1, 2])).toBe(false);
	});

	it("should compare plain objects deeply", () => {
		expect(
			valuesAreEqual({ a: 1, b: { c: [2] } }, { a: 1, b: { c: [2] } }),
		).toBe(true);
		expect(valuesAreEqual({ a: 1 }, { a: 2 })).toBe(false);
		expect(valuesAreEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
		expect(valuesAreEqual({ a: 1 }, { b: 1 })).toBe(false);
	});
});
