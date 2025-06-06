import { paginateItems } from "./paginate-items";

describe("paginateItems", () => {
	const data = Array.from({ length: 50 }, (_, i) => i + 1);

	it("should be able to return the first page by default", () => {
		const result = paginateItems(data, { page: 1, perPage: 10 });

		expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});

	it("should be able to return the second page of items", () => {
		const result = paginateItems(data, { page: 2, perPage: 10 });

		expect(result).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
	});

	it("should be able to return fewer items if on the last page", () => {
		const result = paginateItems(data, { page: 5, perPage: 12 });

		expect(result).toEqual([49, 50]);
	});

	it("should be able to return an empty array if page is out of range", () => {
		const result = paginateItems(data, { page: 6, perPage: 10 });

		expect(result).toEqual([]);
	});

	it("should be able to return all items if perPage exceeds total items", () => {
		const result = paginateItems(data, { page: 1, perPage: 100 });

		expect(result).toEqual(data);
	});

	it("should be able to handle empty list", () => {
		const result = paginateItems([], { page: 1, perPage: 10 });

		expect(result).toEqual([]);
	});

	it("should be able to handle non-default page and perPage", () => {
		const result = paginateItems(data, { page: 3, perPage: 7 });

		expect(result).toEqual([15, 16, 17, 18, 19, 20, 21]);
	});

	it("should not be able to return items for page 0 or less", () => {
		const result = paginateItems(data, { page: 0, perPage: 10 });

		expect(result).toEqual([]);
	});
});
