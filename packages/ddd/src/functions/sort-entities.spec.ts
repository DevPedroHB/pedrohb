import { makeTestEntity } from "#test/factories/make-test-entity.js";
import { sortEntities } from "./sort-entities.js";

describe("sortEntities", () => {
	it("sorts entities by criteria in order and preserves the original array", () => {
		const olderZ = makeTestEntity({ name: "Zed", age: 30 }).entity;
		const olderA = makeTestEntity({ name: "Ada", age: 30 }).entity;
		const younger = makeTestEntity({ name: "Bea", age: 20 }).entity;
		const entities = [olderZ, younger, olderA];

		const sorted = sortEntities(entities, [
			{ field: "age", factor: 1 },
			{ field: "name", factor: -1 },
		]);

		expect(sorted).toEqual([younger, olderZ, olderA]);
		expect(entities).toEqual([olderZ, younger, olderA]);
	});

	it("places nullish values last regardless of sort direction", () => {
		const entities = [
			{ name: null },
			{ name: "B" },
			{ name: undefined },
			{ name: "A" },
		] as never;

		expect(
			sortEntities(entities, [{ field: "name", factor: -1 }] as never),
		).toEqual([entities[1], entities[3], entities[0], entities[2]]);
	});
});
