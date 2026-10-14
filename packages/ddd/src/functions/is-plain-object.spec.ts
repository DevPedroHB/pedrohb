import { isPlainObject } from "./is-plain-object.js";

describe("isPlainObject", () => {
	it("should return true for plain object literals", () => {
		expect(isPlainObject({})).toBe(true);
		expect(isPlainObject({ foo: "bar" })).toBe(true);
	});

	it("should return true for objects created with Object.create(null)", () => {
		expect(isPlainObject(Object.create(null))).toBe(true);
	});

	it("should return false for non-object values", () => {
		expect(isPlainObject(null)).toBe(false);
		expect(isPlainObject(undefined)).toBe(false);
		expect(isPlainObject("string")).toBe(false);
		expect(isPlainObject(42)).toBe(false);
		expect(isPlainObject(true)).toBe(false);
	});

	it("should return false for arrays", () => {
		expect(isPlainObject([])).toBe(false);
	});

	it("should return false for instances with a custom prototype", () => {
		class Foo {}

		expect(isPlainObject(new Foo())).toBe(false);
		expect(isPlainObject(new Date())).toBe(false);
	});
});
