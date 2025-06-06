/**
 * Representa um erro indicando que o método requisitado não foi implementado.
 * Normalmente utilizado quando um endpoint ou funcionalidade ainda não foi desenvolvido.
 */
export class MethodNotImplementedError extends Error {
	/**
	 * Nome da classe de erro.
	 */
	public readonly name = "MethodNotImplemented";
	/**
	 * Código HTTP correspondente ao erro de método não implementado (`501 Not Implemented`).
	 */
	public readonly statusCode = 501;

	/**
	 * Cria uma nova instância de `MethodNotImplementedError`.
	 * @param message Mensagem descritiva do erro.
	 * @param options Opções adicionais para o erro.
	 */
	constructor(
		message = "Método não implementado. Verifique se o recurso solicitado existe e tente novamente.",
		options?: ErrorOptions,
	) {
		super(message, options);

		// Corrige o protótipo para manter instanceof funcional.
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
