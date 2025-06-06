import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import crypto from "node:crypto";
import { formatCacheKey } from "./format-cache-key";

describe("formatCacheKey", () => {
	const originalEnv = process.env.NODE_ENV;

	beforeEach(() => {
		process.env.NODE_ENV = "test";
	});

	afterEach(() => {
		process.env.NODE_ENV = originalEnv;
	});

	it("should be able to generate a basic key with environment and slugified values", () => {
		const key = formatCacheKey("user", {
			name: "Alice Smith",
			role: "Admin User",
		});

		expect(key).toBe("test:user:name:alice_smith:role:admin_user");
	});

	it("should not be able to include null or undefined values", () => {
		const key = formatCacheKey("config", {
			a: null,
			b: "Active",
			c: undefined,
		});

		expect(key).toBe("test:config:b:active");
	});

	it("should be able to hash object values using SHA-1", () => {
		const payload = {
			settings: { darkMode: true, language: "pt" },
		};

		const expectedHash = crypto
			.createHash("sha1")
			.update(JSON.stringify(payload.settings))
			.digest("hex");

		const key = formatCacheKey("preferences", payload);

		expect(key).toBe(`test:preferences:settings:${expectedHash}`);
	});

	it("should be able to slugify keys with dashes and values with underscores", () => {
		const key = formatCacheKey("data", {
			userId: 42,
			sessionStatus: "active now",
		});

		expect(key).toBe("test:data:session-status:active_now:user-id:42");
	});

	it("should be able to truncate key if it exceeds 100 characters", () => {
		const longPayload = {
			foo: "a".repeat(80),
			bar: "b".repeat(80),
		};

		const key = formatCacheKey("long", longPayload);

		expect(key.length).toBeLessThanOrEqual(100);
	});

	it("should be able to fallback to 'dev' if NODE_ENV is not defined", () => {
		// biome-ignore lint/performance/noDelete: <explanation>
		delete process.env.NODE_ENV;

		const key = formatCacheKey("fallback", { a: 1 });

		expect(key.startsWith("dev:fallback:")).toBe(true);
	});

	it("should not be able to accept an empty prefix", () => {
		expect(() => formatCacheKey("", { a: 1 })).toThrow(InvalidCredentialsError);
	});
});
