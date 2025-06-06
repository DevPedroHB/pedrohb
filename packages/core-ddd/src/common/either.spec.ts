import { Error, Success, error, success } from "./either";

describe("Either", () => {
	it("should be able to create an Error instance using the error function", () => {
		const result = error<string, number>("Something went wrong");

		expect(result).toBeInstanceOf(Error);
		expect(result.isError()).toBe(true);
		expect(result.isSuccess()).toBe(false);
		expect(result.value).toBe("Something went wrong");
	});

	it("should be able to create a Success instance using the success function", () => {
		const result = success<string, number>(42);

		expect(result).toBeInstanceOf(Success);
		expect(result.isSuccess()).toBe(true);
		expect(result.isError()).toBe(false);
		expect(result.value).toBe(42);
	});

	it("should be able to narrow type using isSuccess", () => {
		const result = success<string, string>("ok");

		if (result.isSuccess()) {
			const val: string = result.value;

			expect(val).toBe("ok");
		} else {
			fail("Expected result to be Success");
		}
	});

	it("should be able to narrow type using isError", () => {
		const result = error<string, string>("fail");

		if (result.isError()) {
			const val: string = result.value;

			expect(val).toBe("fail");
		} else {
			fail("Expected result to be Error");
		}
	});

	it("should not be able to treat an Error as a Success", () => {
		const result = error<string, string>("fail");

		expect(result.isSuccess()).toBe(false);
	});

	it("should not be able to treat a Success as an Error", () => {
		const result = success<string, string>("ok");

		expect(result.isError()).toBe(false);
	});
});
