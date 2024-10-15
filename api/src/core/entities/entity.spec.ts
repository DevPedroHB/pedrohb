import { TestEntity } from "test/entities/test-entity";
import { UniqueEntityID } from "./unique-entity-id";

describe("Entity", () => {
	it("should be able to create a TestEntity with name and email", () => {
		const entity = TestEntity.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
		});

		expect(entity).toBeDefined();
		expect(entity.name).toBe("John Doe");
		expect(entity.email).toBe("john.doe@example.com");
		expect(entity.age).toBe(30);
	});

	it("should be able to create a TestEntity with a provided createdAt", () => {
		const customDate = new Date("2023-01-01");
		const entity = TestEntity.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
			createdAt: customDate,
		});

		expect(entity.createdAt).toBe(customDate);
	});

	it("should be able to update the name and email properties", () => {
		const entity = TestEntity.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
		});

		entity.name = "Jane Doe";
		entity.email = "jane.doe@example.com";
		entity.age = 25;

		expect(entity.name).toBe("Jane Doe");
		expect(entity.email).toBe("jane.doe@example.com");
		expect(entity.age).toBe(25);
	});

	it("should be able to compare two entities with the same ID as equal", () => {
		const id = new UniqueEntityID();
		const entity1 = TestEntity.create(
			{ name: "John Doe", email: "john.doe@example.com", age: 30 },
			id,
		);
		const entity2 = TestEntity.create(
			{ name: "Jane Doe", email: "jane.doe@example.com", age: 25 },
			id,
		);

		expect(entity1.equals(entity2)).toBe(true);
	});

	it("should be able to compare two entities with different IDs as not equal", () => {
		const entity1 = TestEntity.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
		});
		const entity2 = TestEntity.create({
			name: "Jane Doe",
			email: "jane.doe@example.com",
			age: 25,
		});

		expect(entity1.equals(entity2)).toBe(false);
	});
});
