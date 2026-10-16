import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sleep } from "./sleep.js";

describe("sleep", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should resolve after the given amount of seconds", async () => {
		const promise = sleep(1);
		let resolved = false;

		promise.then(() => {
			resolved = true;
		});

		await vi.advanceTimersByTimeAsync(999);

		expect(resolved).toBe(false);

		await vi.advanceTimersByTimeAsync(1);

		await promise;

		expect(resolved).toBe(true);
	});

	it("should default to 2 seconds", async () => {
		const promise = sleep();
		let resolved = false;

		promise.then(() => {
			resolved = true;
		});

		await vi.advanceTimersByTimeAsync(1999);

		expect(resolved).toBe(false);

		await vi.advanceTimersByTimeAsync(1);

		await promise;

		expect(resolved).toBe(true);
	});
});
