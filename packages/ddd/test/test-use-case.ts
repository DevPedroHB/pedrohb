import { err, ok, type Result } from "@pedrohb/errors";
import { UseCase } from "#/index.js";
import { TestEntity } from "./test-entity.js";
import { TestError } from "./test-error.js";

export type TestUseCaseRequest = {
	name: string;
	age: number;
};

export type TestUseCaseResponse = Result<
	{
		testEntity: TestEntity;
	},
	TestError
>;

export class TestUseCase extends UseCase<
	TestUseCaseRequest,
	TestUseCaseResponse
> {
	public async execute({
		name,
		age,
	}: TestUseCaseRequest): Promise<TestUseCaseResponse> {
		if (age < 18) {
			return err(
				new TestError("MINIMUM_AGE_NOT_MET", {
					params: {
						age,
					},
				}),
			);
		}

		const testEntity = TestEntity.create({
			name,
			age,
		});

		return ok({
			testEntity,
		});
	}
}
