import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { ULID } from "./ulid";

describe("ULID", () => {
	it("should be able to generate a valid ULID", () => {
		const ulid = ULID.generate();

		expect(ULID.isValid(ulid)).toBe(true);
	});

	it("should be able to create a valid ULID instance", () => {
		const ulid = ULID.create();

		expect(ulid).toBeInstanceOf(ULID);
		expect(ULID.isValid(ulid.toValue())).toBe(true);
	});

	it("should not be able to create an invalid ULID instance", () => {
		expect(() => ULID.create("invalid")).toThrow(InvalidCredentialsError);
	});

	it("should be able to decode time from ULID", () => {
		const raw = ULID.generate();
		const time = ULID.decodeTime(raw);

		expect(typeof time).toBe("number");
	});

	it("should be able to encode a timestamp into ULID format", () => {
		const now = Date.now();
		const encoded = ULID.encodeTime(now);

		expect(typeof encoded).toBe("string");
		expect(encoded.length).toBeGreaterThan(0);
	});

	it("should be able to fix ULID base32", () => {
		const raw = ULID.generate();
		const fixed = ULID.fixULIDBase32(raw);

		expect(fixed).toEqual(raw);
	});

	it("should be able to increment base32 ULID string", () => {
		const raw = ULID.generate();
		const incremented = ULID.incrementBase32(raw);

		expect(typeof incremented).toBe("string");
		expect(incremented.length).toBe(raw.length);
	});

	it("should be able to convert ULID to UUID", () => {
		const raw = ULID.generate();
		const uuid = ULID.ulidToUUID(raw);

		expect(uuid).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
		);
	});

	it("should be able to convert UUID to ULID", () => {
		const rawUlid = ULID.generate();
		const uuid = ULID.ulidToUUID(rawUlid);
		const backToUlid = ULID.uuidToULID(uuid);

		expect(ULID.isValid(backToUlid)).toBe(true);
	});
});
