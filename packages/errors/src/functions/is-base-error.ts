import type { BaseError } from "#/base-error.js";

/**
 * Símbolo usado como marca ("brand") para identificar instâncias de
 * `BaseError` em tempo de execução.
 *
 * É criado com `Symbol.for` que consulta o registro global de símbolos. Assim
 * mesmo que o pacote seja carregado mais de uma vez (ex.: versões duplicadas
 * em `node_modules` ou diferentes bundles), todas as cópias compartilham o
 * mesmo símbolo e {@link isBaseError} continua reconhecendo os erros, algo que
 * `instanceof` sozinho não garante.
 */
export const BASE_ERROR_BRAND = Symbol.for("@pedrohb/errors/base-error");

/**
 * Verifica se um valor é uma instância de `BaseError` funcionando como um
 * type guard.
 *
 * A checagem exige que o valor seja uma instância de `Error` e que possua a
 * propriedade marcada por {@link BASE_ERROR_BRAND} com o valor `true`. Por
 * usar a marca em vez de `instanceof BaseError`, o resultado é confiável
 * mesmo quando há múltiplas cópias do pacote carregadas na mesma aplicação.
 *
 * @param value - Valor a ser verificado.
 * @returns `true` se `value` for um `BaseError` (e nesse caso o TypeScript
 * restringe o tipo para `BaseError`); caso contrário `false`.
 *
 * @example
 * ```ts
 * try {
 *   await execute();
 * } catch (error) {
 *   if (isBaseError(error)) {
 *     console.log(error.code); // `error` é tipado como BaseError
 *   } else {
 *     throw error;
 *   }
 * }
 *
 * isBaseError(new Error("comum")); // false
 * isBaseError("texto");            // false
 * isBaseError(null);               // false
 * ```
 */
export function isBaseError(value: unknown): value is BaseError {
	return (
		value instanceof Error &&
		(value as { [BASE_ERROR_BRAND]?: unknown })[BASE_ERROR_BRAND] === true
	);
}
