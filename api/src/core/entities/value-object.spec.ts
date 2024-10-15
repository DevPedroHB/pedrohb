import { TestValueObject } from "test/entities/test-value-object";

describe("Value object", () => {
	it("should be able to create a ValueObject with the correct properties", () => {
		const props = {
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
			createdAt: new Date(),
		};
		const vo = TestValueObject.create(props);

		expect(vo.props).toEqual(props);
	});

	it("should be able to compare two ValueObjects with the same properties as equal", () => {
		const props = {
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
			createdAt: new Date(),
		};
		const vo1 = TestValueObject.create(props);
		const vo2 = TestValueObject.create(props);

		expect(vo1.equals(vo2)).toBe(true);
	});

	it("should be able to compare two ValueObjects with different properties as not equal", () => {
		const vo1 = TestValueObject.create({
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
			createdAt: new Date(),
		});
		const vo2 = TestValueObject.create({
			name: "Jane Doe",
			email: "jane.doe@example.com",
			age: 25,
			createdAt: new Date(),
		});

		expect(vo1.equals(vo2)).toBe(false);
	});

	it("should be able to maintain immutability of props", () => {
		const props = {
			name: "John Doe",
			email: "john.doe@example.com",
			age: 30,
			createdAt: new Date(),
		};
		const vo = TestValueObject.create(props);

		expect(() => {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			(vo.props as any).name = "Jane Doe";
		}).toThrow(TypeError);
	});
});
