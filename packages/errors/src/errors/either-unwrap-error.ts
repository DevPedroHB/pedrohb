export class EitherUnwrapError extends Error {
	public override readonly name = "EitherUnwrapError";

	public constructor(
		message = "Chamado unwrap() ou unwrapErr() em resultado incompatível.",
		options?: ErrorOptions,
	) {
		super(message, options);

		Object.setPrototypeOf(this, EitherUnwrapError.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, EitherUnwrapError);
		}
	}
}
