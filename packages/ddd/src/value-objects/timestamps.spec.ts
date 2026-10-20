import { faker } from "@faker-js/faker";
import { DDDError } from "#/errors/ddd-error.js";
import { Timestamps } from "./timestamps.js";

describe("Timestamps", () => {
	it("should create timestamps with the current date", () => {
		const timestamps = Timestamps.create();

		expect(timestamps).toBeInstanceOf(Timestamps);
		expect(timestamps.createdAt).toBeInstanceOf(Date);
		expect(timestamps.updatedAt).toBeInstanceOf(Date);
		expect(timestamps.createdAt).toEqual(timestamps.updatedAt);
	});

	it("should create timestamps with the given date", () => {
		const now = faker.date.recent();
		const timestamps = Timestamps.create(now);

		expect(timestamps.createdAt).toEqual(now);
		expect(timestamps.updatedAt).toEqual(now);
	});

	it("should serialize to ISO strings", () => {
		const now = faker.date.recent();
		const timestamps = Timestamps.create(now);

		expect(timestamps.toJSON()).toEqual({
			createdAt: now.toISOString(),
			updatedAt: now.toISOString(),
		});
	});

	it("should be equal to timestamps with the same dates", () => {
		const now = faker.date.recent();
		const first = Timestamps.create(now);
		const second = Timestamps.create(now);

		expect(first.equals(second)).toBe(true);
	});

	it("should not be equal to timestamps with different dates", () => {
		const past = Timestamps.create(faker.date.past());
		const future = Timestamps.create(faker.date.future());

		expect(past.equals(future)).toBe(false);
	});

	it("should restore timestamps from dates", () => {
		const createdAt = faker.date.past();
		const updatedAt = faker.date.recent();
		const timestamps = Timestamps.restore(createdAt, updatedAt);

		expect(timestamps.createdAt).toEqual(createdAt);
		expect(timestamps.updatedAt).toEqual(updatedAt);
	});

	it("should touch updatedAt keeping createdAt", () => {
		const past = faker.date.past();
		const now = new Date();
		const original = Timestamps.create(past);
		const timestamps = original.touch(now);

		expect(timestamps).not.toBe(original);
		expect(original.updatedAt).toEqual(past);
		expect(timestamps.createdAt).toEqual(past);
		expect(timestamps.updatedAt).toEqual(now);
	});

	it("should not move updatedAt backwards when touching with a past date", () => {
		const now = faker.date.recent();
		const past = faker.date.past();
		const original = Timestamps.create(now);
		const timestamps = original.touch(past);

		expect(timestamps).not.toBe(original);
		expect(timestamps.updatedAt).toEqual(now);
	});

	it("should throw when updatedAt is before createdAt", () => {
		expect(() => Timestamps.restore(new Date(2000), new Date(1000))).toThrow(
			DDDError,
		);
	});
});
