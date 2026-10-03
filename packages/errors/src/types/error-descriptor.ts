/**
 * Descreve um erro do catálogo: um código identificador e a mensagem associada.
 *
 * A mensagem pode conter placeholders (ex.: `"Usuário {id} não encontrado"`),
 * que são preenchidos com os parâmetros informados na criação do erro.
 *
 * @template Code - Tipo literal do código do erro. Por padrão, `string`.
 * @template Message - Tipo literal da mensagem do erro. Por padrão, `string`.
 *
 * @example
 * ```ts
 * const USER_NOT_FOUND = {
 *   code: "USER_NOT_FOUND",
 *   message: "Usuário {id} não encontrado",
 * } as const satisfies ErrorDescriptor;
 * ```
 */
export interface ErrorDescriptor<
	Code extends string = string,
	Message extends string = string,
> {
	/** Código único que identifica o erro (ex.: `"USER_NOT_FOUND"`). */
	readonly code: Code;
	/** Mensagem do erro, podendo conter placeholders como `{id}`. */
	readonly message: Message;
}
