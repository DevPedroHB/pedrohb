import { dddEnv } from "#/envs/ddd-env.js";
import { DDDError } from "#/errors/ddd-error.js";
import { Snowflake } from "./snowflake.js";

describe("Snowflake", () => {
	it("should creates a valid snowflake and serializes it as a string", () => {
		const snowflake = Snowflake.create();

		expect(Snowflake.isValid(snowflake.id)).toBe(true);
		expect(snowflake.toJSON()).toEqual({ id: snowflake.id.toString() });
	});

	it("should rejects IDs outside the signed 64-bit range", () => {
		expect(Snowflake.isValid(-1n)).toBe(false);
		expect(Snowflake.isValid(1n << 63n)).toBe(false);
		expect(() => Snowflake.create(-1n)).toThrow(DDDError);
	});

	it("should rejects a snowflake with a future timestamp", () => {
		const futureTimestamp = BigInt(Date.now() + 60_000);
		const futureId = (futureTimestamp - dddEnv.DDD_SNOWFLAKE_EPOCH) << 22n;

		expect(Snowflake.isValid(futureId)).toBe(false);
	});
});
