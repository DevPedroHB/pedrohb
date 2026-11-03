import { toCriteria } from "./to-criteria.js";

describe("toCriteria", () => {
	it("should converts sort directions to factors and omits undefined directions", () => {
		expect(
			toCriteria({ name: "asc", createdAt: "desc", updatedAt: undefined }),
		).toEqual([
			{ field: "name", factor: 1 },
			{ field: "createdAt", factor: -1 },
		]);
	});

	it("should returns an empty list when no sort criteria are provided", () => {
		expect(toCriteria({})).toEqual([]);
	});
});
