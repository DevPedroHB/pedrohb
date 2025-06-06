import { filterItemsByFields } from "./filter-items-by-fields";

describe("filterItemsByFields", () => {
	const data = [
		{ id: 1, name: "Alice", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
		{ id: 2, name: "Bob", age: 25, meta: { level: 2 }, tags: ["b", "c"] },
		{ id: 3, name: "Charlie", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
		{ id: 4, name: "Diana", age: null, meta: null, tags: [] },
		{ id: 5, name: "Eve", age: undefined, meta: undefined, tags: ["z"] },
	];

	it("should be able to return all items when fields are empty", () => {
		const result = filterItemsByFields(data, {});

		expect(result).toEqual(data);
	});

	it("should be able to filter items by primitive fields", () => {
		const result = filterItemsByFields(data, { age: 30 });

		expect(result).toEqual([
			{ id: 1, name: "Alice", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
			{ id: 3, name: "Charlie", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
		]);
	});

	it("should be able to filter items by null fields", () => {
		const result = filterItemsByFields(data, { age: null });

		expect(result).toEqual([
			{ id: 4, name: "Diana", age: null, meta: null, tags: [] },
			{ id: 5, name: "Eve", age: undefined, meta: undefined, tags: ["z"] },
		]);
	});

	it("should be able to filter by object fields using deep equality", () => {
		const result = filterItemsByFields(data, { meta: { level: 1 } });

		expect(result).toEqual([
			{ id: 1, name: "Alice", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
			{ id: 3, name: "Charlie", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
		]);
	});

	it("should be able to filter by array fields using deep equality", () => {
		const result = filterItemsByFields(data, { tags: ["a", "b"] });

		expect(result).toEqual([
			{ id: 1, name: "Alice", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
			{ id: 3, name: "Charlie", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
		]);
	});

	it("should not be able to return items when object or array structure does not match", () => {
		const result = filterItemsByFields(data, { meta: { level: 99 } });

		expect(result).toEqual([]);
	});

	it("should not be able to return items when array order differs (if strict)", () => {
		const result = filterItemsByFields(data, { tags: ["b", "a"] });

		expect(result).toEqual([]);
	});

	it("should be able to filter by multiple fields including primitives and objects", () => {
		const result = filterItemsByFields(data, {
			age: 30,
			meta: { level: 1 },
			tags: ["a", "b"],
		});

		expect(result).toEqual([
			{ id: 1, name: "Alice", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
			{ id: 3, name: "Charlie", age: 30, meta: { level: 1 }, tags: ["a", "b"] },
		]);
	});
});
