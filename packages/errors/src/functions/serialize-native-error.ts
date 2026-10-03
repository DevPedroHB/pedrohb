import {
	type SeenReferences,
	serializeCauseError,
} from "./serialize-cause-error.js";

/**
 * Representação serializável de um `Error` nativo (ou de uma subclasse que
 * não seja `BaseError`), composta apenas por valores simples e apropriada para
 * `JSON.stringify`, logs ou transmissão.
 *
 * As propriedades `cause`, `errors` e `stack` são opcionais e só aparecem
 * quando o erro as possui (ou no caso de `stack` quando solicitado).
 */
export type SerializedNativeError = Readonly<{
	/** Causa do erro já serializada com {@link serializeCauseError}. */
	cause?: unknown;
	/**
	 * Lista de erros agregados já serializados. Presente em erros como
	 * `AggregateError` que expõem uma propriedade `errors` do tipo array.
	 */
	errors?: readonly unknown[];
	/** Mensagem do erro. */
	message: string;
	/** Nome do erro (ex.: `"Error"`, `"TypeError"`, `"AggregateError"`). */
	name: string;
	/** Stack trace do erro presente apenas se `includeStack` for `true`. */
	stack?: string;
}>;

/**
 * Serializa um `Error` nativo para um objeto simples
 * ({@link SerializedNativeError}) apropriado para `JSON.stringify`, logs ou
 * transmissão.
 *
 * O resultado sempre contém `message` e `name`. As demais propriedades são
 * incluídas apenas quando aplicável:
 * - `cause`: se o erro tiver causa (`error.cause !== undefined`) serializada
 *   com {@link serializeCauseError};
 * - `errors`: se o erro tiver uma propriedade `errors` que seja um array
 *   (como em `AggregateError`) com cada item serializado com
 *   {@link serializeCauseError};
 * - `stack`: somente se `includeStack` for `true`.
 *
 * **Referências circulares:** o erro é registrado em `seen` durante a
 * serialização e removido ao final (mesmo se ocorrer uma exceção). Assim se
 * `cause` ou algum item de `errors` apontar de volta para este mesmo erro, o
 * ponto de repetição é substituído por `"[Circular]"` em vez de causar
 * recursão infinita. Por ser removido ao terminar, o mesmo erro pode aparecer
 * em lugares distintos (sem ciclo) e ser serializado por completo em cada um.
 *
 * **Limitações:** apenas `message`, `name`, `cause`, `errors` e `stack` são
 * copiados. Propriedades adicionais definidas em subclasses (ex.: `code` ou
 * `status`) não são incluídas.
 *
 * @param error - `Error` a ser serializado.
 * @param includeStack - Se `true` inclui o stack trace no resultado e o
 * repassa à serialização da causa e dos erros agregados. Por padrão, `false`.
 * @param seen - Conjunto de referências em processo de serialização usado
 * internamente na recursão para detectar ciclos. Em geral não deve ser
 * informado; por padrão, um novo `WeakSet` vazio.
 * @returns Objeto serializável que representa o erro.
 *
 * @example
 * ```ts
 * serializeNativeError(new TypeError("valor inválido"));
 * // { message: "valor inválido", name: "TypeError" }
 *
 * // Com stack trace
 * serializeNativeError(new Error("falhou"), true);
 * // { message: "falhou", name: "Error", stack: "Error: falhou\n    at ..." }
 *
 * // Com causa
 * serializeNativeError(new Error("falhou", { cause: "timeout" }));
 * // { cause: "timeout", message: "falhou", name: "Error" }
 *
 * // Com erros agregados
 * serializeNativeError(
 *   new AggregateError([new Error("a"), new Error("b")], "vários erros"),
 * );
 * // {
 * //   errors: [
 * //     { message: "a", name: "Error" },
 * //     { message: "b", name: "Error" },
 * //   ],
 * //   message: "vários erros",
 * //   name: "AggregateError",
 * // }
 *
 * // Referência circular
 * const error = new Error("ciclo");
 * error.cause = error;
 * serializeNativeError(error);
 * // { cause: "[Circular]", message: "ciclo", name: "Error" }
 * ```
 */
export function serializeNativeError(
	error: Error,
	includeStack = false,
	seen: SeenReferences = new WeakSet(),
): SerializedNativeError {
	seen.add(error);

	try {
		const errors =
			"errors" in error && Array.isArray(error.errors)
				? (error.errors as unknown[])
				: undefined;

		return {
			...(error.cause !== undefined && {
				cause: serializeCauseError(error.cause, includeStack, seen),
			}),
			...(errors && {
				errors: errors.map((item) =>
					serializeCauseError(item, includeStack, seen),
				),
			}),
			message: error.message,
			name: error.name,
			...(includeStack && { stack: error.stack }),
		};
	} finally {
		seen.delete(error);
	}
}
