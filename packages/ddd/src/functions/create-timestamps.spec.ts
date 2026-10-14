import { faker } from "@faker-js/faker";
import { createTimestamps } from "./create-timestamps.js";

describe("createTimestamps", () => {
	it("should create timestamps with the current date", () => {
		const { createdAt, updatedAt } = createTimestamps();

		expect(createdAt).toBeInstanceOf(Date);
		expect(updatedAt).toBeInstanceOf(Date);
		expect(createdAt).toEqual(updatedAt);
	});

	it("should create timestamps with the given date", () => {
		const now = faker.date.recent();
		const { createdAt, updatedAt } = createTimestamps(now);

		expect(createdAt).toBe(now);
		expect(updatedAt).toBe(now);
	});
});
