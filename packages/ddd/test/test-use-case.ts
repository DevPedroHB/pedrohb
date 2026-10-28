import { err, ok, type Result } from "@pedrohb/errors";
import type { InMemoryRepository, UseCase } from "#/index.js";
import { TestAggregate } from "./test-aggregate.js";
import { TestError } from "./test-error.js";

export type TestUseCaseRequest = {
	name: string;
	age: number;
};

export type TestUseCaseResponse = Result<
	{
		testAggregate: TestAggregate;
	},
	TestError
>;

export class TestUseCase
	implements UseCase<TestUseCaseRequest, TestUseCaseResponse>
{
	public constructor(
		private readonly inMemoryRepository: InMemoryRepository<
			TestAggregate,
			"id"
		>,
	) {}

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

		const testAggregate = TestAggregate.create({
			name,
			age,
		});

		await this.inMemoryRepository.create(testAggregate);

		return ok({
			testAggregate,
		});
	}
}
