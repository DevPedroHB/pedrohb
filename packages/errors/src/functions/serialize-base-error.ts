import type { BaseError } from "#/base-error.js";
import {
	type SeenReferences,
	serializeCauseError,
} from "./serialize-cause-error.js";

/**
 * Representação serializável de um `BaseError` composta apenas por valores
 * simples e apropriada para `JSON.stringify`, logs ou transmissão.
 *
 * As propriedades `cause`, `params` e `stack` são opcionais e só aparecem
 * quando o erro as possui (ou no caso de `stack` quando solicitado).
 */
export type SerializedBaseError = Readonly<{
	/** Causa do erro já serializada com {@link serializeCauseError}. */
	cause?: unknown;
	/** Código do erro conforme o catálogo (ex.: `"USER_NOT_FOUND"`). */
	code: string;
	/** Mensagem do erro já com os placeholders interpolados. */
	message: string;
	/** Nome da classe do erro (ex.: `"BaseError"`). */
	name: string;
	/** Parâmetros usados para interpolar a mensagem já serializados. */
	params?: Readonly<Record<string, unknown>>;
	/** Stack trace do erro presente apenas se `includeStack` for `true`. */
	stack?: string;
}>;

/**
 * Serializa um `BaseError` para um objeto simples ({@link SerializedBaseError})
 * apropriado para `JSON.stringify`, logs ou transmissão.
 *
 * O resultado sempre contém `code`, `message` e `name`. As demais
 * propriedades são incluídas apenas quando aplicável:
 * - `cause`: se o erro tiver causa (`error.cause !== undefined`) serializada
 *   com {@link serializeCauseError};
 * - `params`: se o erro tiver parâmetros (`error.params !== undefined`)
 *   também serializados com {@link serializeCauseError};
 * - `stack`: somente se `includeStack` for `true`.
 *
 * **Referências circulares:** o erro é registrado em `seen` durante a
 * serialização e removido ao final (mesmo se ocorrer uma exceção). Assim se
 * alguma `cause` ou `params` apontar de volta para este mesmo erro, o ponto
 * de repetição é substituído por `"[Circular]"` em vez de causar recursão
 * infinita. Por ser removido ao terminar o mesmo erro pode aparecer em
 * lugares distintos (sem ciclo) e ser serializado por completo em cada um.
 *
 * @param error - `BaseError` a ser serializado.
 * @param includeStack - Se `true` inclui o stack trace no resultado e o
 * repassa à serialização da causa e dos parâmetros. Por padrão, `false`.
 * @param seen - Conjunto de referências em processo de serialização usado
 * internamente na recursão para detectar ciclos. Em geral não deve ser
 * informado; por padrão, um novo `WeakSet` vazio.
 * @returns Objeto serializável que representa o erro.
 *
 * @example
 * ```ts
 * const error = new BaseError(ERROR_CODES.USER_NOT_FOUND, { id: 42 });
 *
 * serializeBaseError(error);
 * // {
 * //   code: "USER_NOT_FOUND",
 * //   message: "Usuário 42 não encontrado",
 * //   name: "BaseError",
 * //   params: { id: 42 },
 * // }
 *
 * // Com stack trace
 * serializeBaseError(erro, true);
 * // { ..., stack: "BaseError: Usuário 42 não encontrado\n    at ..." }
 *
 * // Com causa
 * const withCause = new BaseError(ERROR_CODES.INVALID_TOKEN, undefined, {
 *   cause: new Error("expirado"),
 * });
 * serializeBaseError(withCause);
 * // { cause: { ... }, code: "INVALID_TOKEN", message: "Token inválido", name: "BaseError" }
 * ```
 */
export function serializeBaseError(
	error: Readonly<BaseError>,
	includeStack = false,
	seen: SeenReferences = new WeakSet(),
): SerializedBaseError {
	seen.add(error);

	try {
		return {
			...(error.cause !== undefined && {
				cause: serializeCauseError(error.cause, includeStack, seen),
			}),
			code: error.code,
			message: error.message,
			name: error.name,
			...(error.params !== undefined && {
				params: serializeCauseError(
					error.params,
					includeStack,
					seen,
				) as Readonly<Record<string, unknown>>,
			}),
			...(includeStack && { stack: error.stack }),
		};
	} finally {
		seen.delete(error);
	}
}
