import { MethodNotImplementedError } from "@/errors/method-not-implemented-error";
import { UniqueEntityId } from "./unique-entity-id";

class ExampleId extends UniqueEntityId {
	public static create(id: string) {
		return new ExampleId(id);
	}
}

describe("UniqueEntityId", () => {
	it("should be able to return the ID value", () => {
		const id = ExampleId.create("abc-123");

		expect(id.toValue()).toBe("abc-123");
	});

	it("should be able to compare equality by reference", () => {
		const id = ExampleId.create("abc-123");

		expect(id.equals(id)).toBe(true);
	});

	it("should be able to compare equality by value", () => {
		const a = ExampleId.create("abc-123");
		const b = ExampleId.create("abc-123");

		expect(a.equals(b)).toBe(true);
	});

	it("should not be able to compare different IDs", () => {
		const a = ExampleId.create("abc-123");
		const b = ExampleId.create("def-456");

		expect(a.equals(b)).toBe(false);
	});

	it("should be able to return a custom hash", () => {
		const id = ExampleId.create("abc-123");
		const hash = id.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});

	it("should not be able to call static create method on base class", () => {
		expect(() => UniqueEntityId.create("abc-123")).toThrow(
			MethodNotImplementedError,
		);
	});
});
