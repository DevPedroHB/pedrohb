import {
	buildPage,
	DEFAULT_PEER_PAGE,
	resolvePagination,
} from "./pagination.js";

describe("resolvePagination", () => {
	it("should uses defaults and computes the offset", () => {
		expect(resolvePagination()).toEqual({
			page: 1,
			perPage: DEFAULT_PEER_PAGE,
			offset: 0,
		});
		expect(resolvePagination({ page: 3, perPage: 10 })).toEqual({
			page: 3,
			perPage: 10,
			offset: 20,
		});
	});

	it.each([
		{ page: 0 },
		{ perPage: 0 },
		{ page: 1.5 },
		{ perPage: Number.MAX_SAFE_INTEGER + 1 },
	])("should rejects invalid input %j", (input) => {
		expect(() => resolvePagination(input)).toThrow();
	});
});

describe("buildPage", () => {
	it("should returns items and pagination metadata", () => {
		const items = ["a", "b"];

		expect(buildPage(items, 5, { page: 2, perPage: 2 })).toEqual({
			items,
			total: 5,
			page: 2,
			perPage: 2,
			totalPages: 3,
		});
	});

	it("should returns zero total pages when total is zero", () => {
		expect(buildPage([], 0, { page: 1, perPage: 20 }).totalPages).toBe(0);
	});
});
