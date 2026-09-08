import { EitherUnwrapError } from "./errors/either-unwrap-error.js";

export abstract class Either<O, E> {
	public abstract readonly tag: "Ok" | "Err";

	public abstract unwrap(): O;

	public abstract unwrapErr(): E;

	public abstract isOk(): this is Ok<O, E>;

	public abstract isErr(): this is Err<O, E>;

	public map<O2>(fn: (value: O) => O2): Either<O2, E> {
		if (this.isOk()) {
			return ok(fn(this.unwrap()));
		}

		return err(this.unwrapErr());
	}

	public mapErr<E2>(fn: (value: E) => E2): Either<O, E2> {
		if (this.isErr()) {
			return err(fn(this.unwrapErr()));
		}

		return ok(this.unwrap());
	}

	public flatMap<O2, E2>(fn: (value: O) => Either<O2, E2>): Either<O2, E | E2> {
		if (this.isOk()) {
			return fn(this.unwrap());
		}

		return err(this.unwrapErr());
	}

	public orElse<O2, E2>(fn: (value: E) => Either<O2, E2>): Either<O | O2, E2> {
		if (this.isErr()) {
			return fn(this.unwrapErr());
		}

		return ok(this.unwrap());
	}

	public match<R>(
		handlers: Readonly<{ onOk(value: O): R; onErr(value: E): R }>,
	): R {
		if (this.isOk()) {
			return handlers.onOk(this.unwrap());
		}

		return handlers.onErr(this.unwrapErr());
	}
}

export class Ok<O = never, E = never> extends Either<O, E> {
	public readonly tag = "Ok" as const;
	private readonly value: O;

	protected constructor(value: O) {
		super();

		this.value = value;
	}

	public unwrap(): O {
		return this.value;
	}

	public unwrapErr(): E {
		throw new EitherUnwrapError("Chamado unwrapErr() em Ok.", {
			cause: this.value,
		});
	}

	public isOk(): this is Ok<O, E> {
		return true;
	}

	public isErr(): this is Err<O, E> {
		return false;
	}

	public static create<O = never, E = never>(value: O): Ok<O, E> {
		return new Ok(value);
	}
}

export class Err<O = never, E = never> extends Either<O, E> {
	public readonly tag = "Err" as const;
	private readonly value: E;

	protected constructor(value: E) {
		super();

		this.value = value;
	}

	public unwrap(): O {
		throw new EitherUnwrapError("Chamado unwrap() em Err.", {
			cause: this.value,
		});
	}

	public unwrapErr(): E {
		return this.value;
	}

	public isOk(): this is Ok<O, E> {
		return false;
	}

	public isErr(): this is Err<O, E> {
		return true;
	}

	public static create<O = never, E = never>(value: E): Err<O, E> {
		return new Err(value);
	}
}

export function ok<O = never, E = never>(value: O): Either<O, E> {
	return Ok.create(value);
}

export function err<O = never, E = never>(value: E): Either<O, E> {
	return Err.create(value);
}
