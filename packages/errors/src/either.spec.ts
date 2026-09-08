import { type Either, err, ok } from "./either.js";
import { EitherUnwrapError } from "./errors/either-unwrap-error.js";

describe("Either", () => {
	it("should create an Ok with a value", () => {
		const success = ok("Sucesso.");

		expect(success.tag).toBe("Ok");
		expect(success.isOk()).toBe(true);
		expect(success.isErr()).toBe(false);
		expect(success.unwrap()).toBe("Sucesso.");
	});

	it("should create an Err with an error", () => {
		const error = err("Erro.");

		expect(error.tag).toBe("Err");
		expect(error.isOk()).toBe(false);
		expect(error.isErr()).toBe(true);
		expect(error.unwrapErr()).toBe("Erro.");
	});

	it("should throw when unwrapping an Err", () => {
		const error = err("Erro.");

		expect(() => error.unwrap()).toThrow(EitherUnwrapError);
	});

	it("should throw when unwrapping an error from an Ok", () => {
		const success = ok("Sucesso.");

		expect(() => success.unwrapErr()).toThrow(EitherUnwrapError);
	});

	it("should map the value of an Ok", () => {
		const success = ok(2).map((n) => n * 2);

		expect(success.unwrap()).toBe(4);
	});

	it("should preserve the error when mapping an Err", () => {
		const error = err<number, string>("Erro.").map((n) => n * 2);

		expect(error.unwrapErr()).toBe("Erro.");
	});

	it("should map the error of an Err", () => {
		const error = err("Erro.").mapErr((e) => e.toUpperCase());

		expect(error.unwrapErr()).toBe("ERRO.");
	});

	it("should preserve the value when mapping the error of an Ok", () => {
		const success = ok(2).mapErr(() => "Erro.");

		expect(success.unwrap()).toBe(2);
	});

	it("should chain computations with flatMap", () => {
		const success = ok(2).flatMap((n) => ok(n + 1));

		expect(success.unwrap()).toBe(3);
	});

	it("should preserve the original error when chaining an Err with flatMap", () => {
		const error = err<number, string>("Erro.").flatMap((n) => ok(n + 1));

		expect(error.unwrapErr()).toBe("Erro.");
	});

	it("should recover from an Err with orElse", () => {
		const error = err<number, string>("Erro.").orElse(() => ok(0));

		expect(error.unwrap()).toBe(0);
	});

	it("should preserve the value of an Ok with orElse", () => {
		const success = ok(2).orElse(() => ok(0));

		expect(success.unwrap()).toBe(2);
	});

	it("should match both Ok and Err states", () => {
		expect(
			ok(1).match({
				onOk(v) {
					return v;
				},
				onErr() {
					return 0;
				},
			}),
		).toBe(1);

		expect(
			err("x").match({
				onOk() {
					return "y";
				},
				onErr(e) {
					return e;
				},
			}),
		).toBe("x");
	});

	it("should narrow the type with isOk", () => {
		const success: Either<number, string> = ok(1) as Either<number, string>;

		if (success.isOk()) {
			const value: number = success.unwrap();

			expect(value).toBe(1);
		}

		const error: Either<number, string> = err("x") as Either<number, string>;

		if (error.isErr()) {
			const value: string = error.unwrapErr();

			expect(value).toBe("x");
		}
	});
});
