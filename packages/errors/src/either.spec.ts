import { type Either, err, ok } from "./either.js";
import { EitherUnwrapError } from "./errors/either-unwrap-error.js";

describe("Either", () => {
	const success: Either<string, string> = ok("Sucesso.");
	const error: Either<string, string> = err("Erro.");

	it("should create an Ok with a value", () => {
		expect(success.tag).toBe("Ok");
		expect(success.isOk()).toBe(true);
		expect(success.isErr()).toBe(false);
		expect(success.unwrap()).toBe("Sucesso.");
	});

	it("should create an Err with an error", () => {
		expect(error.tag).toBe("Err");
		expect(error.isOk()).toBe(false);
		expect(error.isErr()).toBe(true);
		expect(error.unwrapErr()).toBe("Erro.");
	});

	it("should throw when unwrapping an Err", () => {
		expect(() => error.unwrap()).toThrow(EitherUnwrapError);
	});

	it("should throw when unwrapping an error from an Ok", () => {
		expect(() => success.unwrapErr()).toThrow(EitherUnwrapError);
	});

	it("should map the value of an Ok", () => {
		const result = success.map((value) => value.length);

		expect(result.unwrap()).toBe(8);
	});

	it("should preserve the error when mapping an Err", () => {
		const result = error.map((value) => value.length);

		expect(result.unwrapErr()).toBe("Erro.");
	});

	it("should map the error of an Err", () => {
		const result = error.mapErr((value) => value.length);

		expect(result.unwrapErr()).toBe(5);
	});

	it("should preserve the value when mapping the error of an Ok", () => {
		const result = success.mapErr((value) => value.length);

		expect(result.unwrap()).toBe("Sucesso.");
	});

	it("should chain computations with flatMap", () => {
		const result = success.flatMap((value) => ok(value.length));

		expect(result.unwrap()).toBe(8);
	});

	it("should preserve the original error when chaining an Err with flatMap", () => {
		const result = error.flatMap((value) => ok(value.length));

		expect(result.unwrapErr()).toBe("Erro.");
	});

	it("should recover from an Err with orElse", () => {
		const result = error.orElse((value) => ok(value.length));

		expect(result.unwrap()).toBe(5);
	});

	it("should preserve the value of an Ok with orElse", () => {
		const result = success.orElse((value) => ok(value.length));

		expect(result.unwrap()).toBe("Sucesso.");
	});

	it("should match both Ok and Err states", () => {
		expect(
			success.match({
				onOk(value) {
					return `onOk ${value}`;
				},
				onErr(value) {
					return `onErr ${value}`;
				},
			}),
		).toBe("onOk Sucesso.");

		expect(
			error.match({
				onOk(value) {
					return `onOk ${value}`;
				},
				onErr(value) {
					return `onErr ${value}`;
				},
			}),
		).toBe("onErr Erro.");
	});
});
