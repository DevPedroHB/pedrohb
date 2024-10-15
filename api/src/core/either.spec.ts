import { type Either, error, success } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, number> {
	if (shouldSuccess) {
		return success(10);
	}

	return error("error");
}

describe("Either", () => {
	it("should be able to error result", () => {
		const errorResult = doSomething(false);

		expect(errorResult.isError()).toBe(true);
		expect(errorResult.isSuccess()).toBe(false);
	});

	it("should be able to success result", () => {
		const successResult = doSomething(true);

		expect(successResult.isSuccess()).toBe(true);
		expect(successResult.isError()).toBe(false);
	});
});
