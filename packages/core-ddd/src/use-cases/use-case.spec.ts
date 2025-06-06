import { UseCase } from "./use-case";

class TestUseCase extends UseCase<{ input: string }, { output: string }> {
	public async execute(request: { input: string }): Promise<{
		output: string;
	}> {
		return { output: request.input.toUpperCase() };
	}
}

let testUseCase: TestUseCase;

describe("UseCase", () => {
	beforeEach(() => {
		testUseCase = new TestUseCase();
	});

	it("should be able to execute the use case and return the expected response", async () => {
		const request = { input: "hello" };
		const response = await testUseCase.execute(request);

		expect(response).toEqual({ output: "HELLO" });
	});

	it("should be able to return the correct hash signature", () => {
		const hash = testUseCase.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});
});
