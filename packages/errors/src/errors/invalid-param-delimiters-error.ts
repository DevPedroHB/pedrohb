/**
 * Erro lançado quando os delimitadores de placeholders são inválidos, ou
 * seja, quando `open` ou `close` é uma string vazia.
 *
 * Estende `TypeError` pois indica um valor de formato inadequado. É lançado
 * em tempo de execução por `createParamPlaceholder` e por consequência, por
 * quem o utiliza como `interpolateErrorMessage` e o construtor de
 * `BaseError`.
 *
 * O `name` do erro é o nome da classe concreta (`new.target.name`) e o
 * protótipo é ajustado explicitamente para que `instanceof` funcione mesmo em
 * subclasses e em alvos de compilação antigos.
 *
 * @example
 * ```ts
 * try {
 *   createParamPlaceholder({ open: "", close: "}" });
 * } catch (error) {
 *   if (error instanceof InvalidParamDelimitersError) {
 *     error.message; // "Os delimitadores open e close não podem ser vazios."
 *   }
 * }
 * ```
 */
export class InvalidParamDelimitersError extends TypeError {
	/**
	 * Cria o erro de delimitadores inválidos.
	 *
	 * @param message - Mensagem do erro. Por padrão, "Os delimitadores open e
	 * close não podem ser vazios.".
	 * @param options - Opções padrão de `Error` como `cause`.
	 */
	public constructor(
		message = "Os delimitadores open e close não podem ser vazios.",
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
