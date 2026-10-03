import { Either } from "#/either.js";

/**
 * Erro lançado quando `unwrap()` é chamado em um `Err` ou `unwrapErr()` é
 * chamado em um `Ok`, ou seja, quando se tenta extrair de um {@link Either}
 * o valor da variante que ele não possui.
 *
 * O valor contido na variante realmente presente é anexado como `cause`
 * (o valor de erro em `unwrap()` num `Err`; o valor de sucesso em
 * `unwrapErr()` num `Ok`). Esse valor pode ser de qualquer tipo, não
 * necessariamente um `Error`.
 *
 * O `name` do erro é o nome da classe concreta (`new.target.name`) e o
 * protótipo é ajustado explicitamente para que `instanceof` funcione mesmo em
 * subclasses e em alvos de compilação antigos.
 *
 * @example
 * ```ts
 * try {
 *   err<number, string>("falhou").unwrap();
 * } catch (error) {
 *   if (error instanceof EitherUnwrapError) {
 *     error.message; // "Chamado unwrap() em Err."
 *     error.cause;   // "falhou"
 *   }
 * }
 * ```
 */
export class EitherUnwrapError extends Error {
	/**
	 * Cria o erro de extração inválida de um `Either`.
	 *
	 * @param message - Mensagem do erro. Por padrão, uma mensagem genérica
	 * ("Chamado unwrap() ou unwrapErr() em resultado incompatível.").
	 * @param options - Opções padrão de `Error` como `cause` que normalmente
	 * carrega o valor contido no `Either`.
	 */
	public constructor(
		message = "Chamado unwrap() ou unwrapErr() em resultado incompatível.",
		options?: ErrorOptions,
	) {
		super(message, options);

		this.name = new.target.name;

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, new.target);
		}
	}
}
