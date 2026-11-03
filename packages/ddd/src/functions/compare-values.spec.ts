import { compareValues } from "./compare-values.js";

describe("compareValues", () => {
	it("should compares strings using natural numeric order", () => {
		expect(compareValues("item 2", "item 10")).toBeLessThan(0);
		expect(compareValues("same", "same")).toBe(0);
	});

	it("should compares numbers and bigints numerically", () => {
		expect(compareValues(2, 10)).toBe(-1);
		expect(compareValues(10n, 2n)).toBe(1);
		expect(compareValues(2, 2n)).toBe(0);
	});

	it("should compares booleans with false before true", () => {
		expect(compareValues(false, true)).toBe(-1);
		expect(compareValues(true, false)).toBe(1);
		expect(compareValues(false, false)).toBe(0);
	});

	it("should falls back to comparing string representations for other values", () => {
		expect(compareValues(null, undefined)).toBeLessThan(0);
		expect(compareValues(null, "null")).toBe(0);
	});
});
