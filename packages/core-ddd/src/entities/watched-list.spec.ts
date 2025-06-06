import { WatchedList } from "./watched-list";

interface Item {
	id: string;
}

class TestWatchedList extends WatchedList<Item> {
	protected compare(a: Item, b: Item): boolean {
		return a.id === b.id;
	}
}

describe("WatchedList", () => {
	const itemA = { id: "a" };
	const itemB = { id: "b" };
	const itemC = { id: "c" };

	it("should be able to add an item to the list", () => {
		const list = new TestWatchedList();

		list.add(itemA);

		expect(list.current).toContainEqual(itemA);
		expect(list.added).toContainEqual(itemA);
	});

	it("should be able to remove an item from the list", () => {
		const list = new TestWatchedList([itemA]);

		list.remove(itemA);

		expect(list.current).not.toContainEqual(itemA);
		expect(list.removed).toContainEqual(itemA);
	});

	it("should not add an item that already exists", () => {
		const list = new TestWatchedList([itemA]);

		list.add(itemA);

		expect(list.current.length).toBe(1);
		expect(list.added.length).toBe(0);
	});

	it("should not remove an item that does not exist", () => {
		const list = new TestWatchedList();

		list.remove(itemA);

		expect(list.current.length).toBe(0);
		expect(list.removed.length).toBe(0);
	});

	it("should be able to track added and removed items", () => {
		const list = new TestWatchedList([itemA]);

		list.add(itemB);
		list.remove(itemA);

		expect(list.added).toContainEqual(itemB);
		expect(list.removed).toContainEqual(itemA);
	});

	it("should be able to reset added if item is removed after add", () => {
		const list = new TestWatchedList();

		list.add(itemA);
		expect(list.added).toContainEqual(itemA);

		list.remove(itemA);
		expect(list.added).not.toContainEqual(itemA);
	});

	it("should be able to update the list with a new set of items", () => {
		const list = new TestWatchedList([itemA, itemB]);

		list.update([itemB, itemC]);

		expect(list.current).toEqual([itemB, itemC]);
		expect(list.removed).toContainEqual(itemA);
		expect(list.added).toContainEqual(itemC);
	});

	it("should be able to compare items correctly using the custom comparator", () => {
		const list = new TestWatchedList();

		list.add({ id: "123" });
		list.add({ id: "123" });

		expect(list.current.length).toBe(1);
	});
});
