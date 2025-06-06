import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { UUID } from "./uuid";

describe("UUID", () => {
	it("should not be able to validate an invalid UUID", () => {
		expect(UUID.isValid("invalid-uuid")).toBe(false);
	});

	it("should be able to create UUID v1", () => {
		const uuid = UUID.generate("v1");

		expect(uuid).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
    expect(UUID.version(uuid)).toBe(1);
	});

  it("should be able to create UUID v3 when value and namespace are provided", () => {
		const uuid = UUID.generate("v3", "example.com", UUID.generate("v4"));

    expect(uuid).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
		expect(UUID.version(uuid)).toBe(3);
	});

	it("should be able to create UUID v4", () => {
		const uuid = UUID.generate("v4");

		expect(uuid).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
    expect(UUID.version(uuid)).toBe(4);
	});

	it("should be able to create UUID v5 when value and namespace are provided", () => {
		const uuid = UUID.generate("v5", "example.com", UUID.generate("v4"));

    expect(uuid).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
		expect(UUID.version(uuid)).toBe(5);
	});

	it("should be able to create UUID v6", () => {
		const uuid = UUID.generate("v6");

    expect(uuid).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-6[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
		expect(UUID.version(uuid)).toBe(6);
	});

	it("should be able to create UUID v7", () => {
		const uuid = UUID.generate("v7");

    expect(uuid).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
		);
		expect(UUID.version(uuid)).toBe(7);
	});

	it("should not be able to generate UUID v3 without value and namespace", () => {
		expect(() => UUID.generate("v3")).toThrow(InvalidCredentialsError);
	});

	it("should not be able to generate UUID v5 without value and namespace", () => {
		expect(() => UUID.generate("v5")).toThrow(InvalidCredentialsError);
	});

	it("should not be able to generate UUID with invalid version", () => {
		expect(() => UUID.generate("invalid" as any)).toThrow(
			InvalidCredentialsError,
		);
	});

	it("should be able to parse and stringify a UUID", () => {
		const original = UUID.generate("v4");
		const parsed = UUID.parse(original);
		const stringified = UUID.stringify(parsed);

		expect(stringified).toBe(original);
	});

	it("should not be able to create an invalid UUID instance", () => {
		expect(() => UUID.create("invalid-uuid")).toThrow(InvalidCredentialsError);
	});

	it("should be able to expose correct version from instance", () => {
		const raw = UUID.generate("v4");
		const uuid = UUID.create(raw);

		expect(uuid.version).toBe(4);
	});
});
