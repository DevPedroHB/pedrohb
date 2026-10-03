import { invalidCodeMessage } from "#/upper-snake-case.js";

/**
 * Erro lançado quando um código de erro não está em UPPER_SNAKE_CASE.
 *
 * Estende `TypeError` pois indica um valor de tipo ou formato inadequado.
 * É lançado em tempo de execução por `defineErrorCatalog` complementando a
 * validação feita em tempo de compilação por `ValidateErrorDefinitions`.
 *
 * A mensagem é gerada por {@link invalidCodeMessage} e o código inválido fica
 * disponível na propriedade `code`.
 *
 * O `name` do erro é o nome da classe concreta (`new.target.name`) e o
 * protótipo é ajustado explicitamente para que `instanceof` funcione mesmo em
 * subclasses e em alvos de compilação antigos.
 *
 * @example
 * ```ts
 * try {
 *   defineErrorCatalog({ userNotFound: "Usuário não encontrado" });
 * } catch (error) {
 *   if (error instanceof InvalidErrorCode) {
 *     error.code;    // "userNotFound"
 *     error.message; // 'Código de erro inválido "userNotFound". Os códigos de erro devem usar UPPER_SNAKE_CASE.'
 *   }
 * }
 * ```
 */
export class InvalidErrorCode extends TypeError {
	/** Código de erro inválido que provocou a exceção. */
	public readonly code: string;

	/**
	 * Cria o erro de código inválido.
	 *
	 * @param code - Código de erro que não está em UPPER_SNAKE_CASE.
	 * @param options - Opções padrão de `Error` como `cause`.
	 */
	public constructor(code: string, options?: ErrorOptions) {
		super(invalidCodeMessage(code), options);

		this.name = new.target.name;
		this.code = code;

		Object.setPrototypeOf(this, new.target.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, new.target);
		}
	}
}
