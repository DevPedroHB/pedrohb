import { UniqueEntityID } from "./unique-entity-id";

describe("Unique entity id", () => {
	it("should be able to create a UniqueEntityID with a valid UUID when no ID is provided", () => {
		const entityId = new UniqueEntityID();

		expect(entityId).toBeDefined();
		expect(entityId.id).toMatch(
			/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
		);
	});

	it("should be able to create a UniqueEntityID with a specific ID when provided", () => {
		const customId = "123e4567-e89b-12d3-a456-426614174000";
		const entityId = new UniqueEntityID(customId);

		expect(entityId.id).toBe(customId);
	});

	it("should be able to return true when comparing two UniqueEntityID instances with the same ID", () => {
		const id = "123e4567-e89b-12d3-a456-426614174000";
		const entityId1 = new UniqueEntityID(id);
		const entityId2 = new UniqueEntityID(id);

		expect(entityId1.equals(entityId2)).toBe(true);
	});

	it("should be able to return false when comparing two UniqueEntityID instances with different IDs", () => {
		const entityId1 = new UniqueEntityID(
			"123e4567-e89b-12d3-a456-426614174000",
		);
		const entityId2 = new UniqueEntityID(
			"987e6543-e21b-65d3-b789-526614174999",
		);

		expect(entityId1.equals(entityId2)).toBe(false);
	});
});
