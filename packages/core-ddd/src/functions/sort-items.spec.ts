import { sortItems } from "./sort-items";

type User = {
	id: number;
	name: string | null;
	age: number | null;
};

const users: User[] = [
	{ id: 3, name: "Zoe", age: 29 },
	{ id: 1, name: "Alice", age: 35 },
	{ id: 2, name: "Bob", age: null },
	{ id: 4, name: null, age: 22 },
];

describe("sortItems", () => {
	it("should be able to sort by one field ascending", () => {
		const sorted = sortItems(users, { name: "asc" });

		expect(sorted.map((u) => u.name)).toEqual(["Alice", "Bob", "Zoe", null]);
	});

	it("should be able to sort by one field descending", () => {
		const sorted = sortItems(users, { name: "desc" });

		expect(sorted.map((u) => u.name)).toEqual([null, "Zoe", "Bob", "Alice"]);
	});

	it("should be able to sort by numeric field ascending", () => {
		const sorted = sortItems(users, { id: "asc" });

		expect(sorted.map((u) => u.id)).toEqual([1, 2, 3, 4]);
	});

	it("should be able to sort by numeric field descending", () => {
		const sorted = sortItems(users, { id: "desc" });

		expect(sorted.map((u) => u.id)).toEqual([4, 3, 2, 1]);
	});

	it("should be able to sort by multiple fields", () => {
		const sorted = sortItems(users, { age: "asc", name: "asc" });

		expect(sorted.map((u) => u.age)).toEqual([22, 29, 35, null]);
	});

	it("should be able to return original order if no criteria is given", () => {
		const sorted = sortItems(users, {});

		expect(sorted).toEqual(users);
	});

	it("should not be able to break on null values", () => {
		const sorted = sortItems(users, { name: "asc" });

		expect(sorted.at(-1)?.name).toBeNull();
	});
});
