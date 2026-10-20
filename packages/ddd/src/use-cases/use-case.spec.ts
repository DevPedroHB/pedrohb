import { faker } from "@faker-js/faker";
import { TestEntity } from "#test/test-entity.js";
import { TestError } from "#test/test-error.js";
import { TestUseCase } from "#test/test-use-case.js";

let testUseCase: TestUseCase;

describe("UseCase", () => {
	beforeEach(() => {
		testUseCase = new TestUseCase();
	});

	it("should return an Ok with the created entity for a valid request", async () => {
		const request = {
			name: faker.person.fullName(),
			age: faker.number.int({ min: 18, max: 100 }),
		};

		const result = await testUseCase.execute(request);

		expect(result.isOk()).toBe(true);
		expect(result.tag).toBe("Ok");

		if (result.isOk()) {
			const { testEntity } = result.unwrap();

			expect(testEntity).toBeInstanceOf(TestEntity);
			expect(testEntity.name).toBe(request.name);
			expect(testEntity.age).toBe(request.age);
		}
	});

	it("should return an Err with a TestError when the minimum age is not met", async () => {
		const result = await testUseCase.execute({
			name: faker.person.fullName(),
			age: faker.number.int({ min: 0, max: 17 }),
		});

		expect(result.isErr()).toBe(true);
		expect(result.tag).toBe("Err");

		if (result.isErr()) {
			expect(TestError.is(result.unwrapErr())).toBe(true);
		}
	});
});
