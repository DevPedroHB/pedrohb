import { waitFor } from "./wait-for";

vi.useFakeTimers();
vi.spyOn(global, "setTimeout");

describe("waitFor", () => {
	it("should be able to resolve if assertion passes immediately", async () => {
		const assertion = vi.fn();

		await expect(waitFor(assertion)).resolves.toBeUndefined();
		expect(assertion).toHaveBeenCalledTimes(1);
	});

	it("should be able to resolve after a few retries", async () => {
		let attempts = 0;
		const assertion = vi.fn(() => {
			attempts++;

			if (attempts < 3) {
				throw new Error("Not yet");
			}
		});
		const promise = waitFor(assertion, { timeout: 1000, interval: 100 });

		vi.advanceTimersByTime(200);

		await Promise.resolve();

		vi.advanceTimersByTime(100);

		await expect(promise).resolves.toBeUndefined();
		expect(assertion).toHaveBeenCalledTimes(3);
	});

	it("should not be able to resolve if assertion keeps failing beyond timeout", async () => {
		const alwaysFail = vi.fn(() => {
			throw new Error("Still failing");
		});
		const promise = waitFor(alwaysFail, { timeout: 300, interval: 100 });

		vi.advanceTimersByTime(100);

		await Promise.resolve();

		vi.advanceTimersByTime(100);

		await Promise.resolve();

		vi.advanceTimersByTime(100);

		await expect(promise).rejects.toThrow("Still failing");
		expect(alwaysFail).toHaveBeenCalledTimes(4);
	});

	it("should be able to support async assertions", async () => {
		let done = false;

		setTimeout(() => {
			done = true;
		}, 200);

		const assertion = vi.fn(async () => {
			if (!done) {
				throw new Error("Not ready");
			}
		});
		const promise = waitFor(assertion, { timeout: 500, interval: 50 });

		vi.advanceTimersByTime(200);

		await Promise.resolve();

		vi.advanceTimersByTime(50);

		await expect(promise).resolves.toBeUndefined();
		expect(assertion).toHaveBeenCalled();
	});

	it("should not be able to run if timeout is zero", async () => {
		const assertion = vi.fn(() => {
			throw new Error("Immediate failure");
		});
		const promise = waitFor(assertion, { timeout: 0, interval: 10 });

		await expect(promise).rejects.toThrow("Immediate failure");
		expect(assertion).toHaveBeenCalledTimes(1);
	});
});
