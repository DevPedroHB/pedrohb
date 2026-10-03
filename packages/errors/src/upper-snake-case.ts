import type {
	InvalidCodeMessage,
	IsUpperSnakeCase,
} from "./types/validate-error-definitions.js";

/**
 * Expressão regular que valida códigos em UPPER_SNAKE_CASE em tempo de
 * execução.
 *
 * Regras (espelham o tipo {@link IsUpperSnakeCase}):
 * - deve começar com uma letra maiúscula (`A-Z`);
 * - pode conter letras maiúsculas, dígitos e `_`;
 * - `_` só pode aparecer entre caracteres alfanuméricos, ou seja, não pode
 *   estar no início nem no fim e não pode ser repetido em sequência.
 */
export const UPPER_SNAKE_CASE = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/;

/**
 * Verifica em tempo de execução, se uma string está em UPPER_SNAKE_CASE.
 *
 * É o equivalente em runtime do tipo {@link IsUpperSnakeCase}, usando a
 * expressão regular {@link UPPER_SNAKE_CASE}.
 *
 * @param value - String a ser verificada.
 * @returns `true` se `value` estiver em UPPER_SNAKE_CASE; caso contrário,
 * `false`.
 *
 * @example
 * ```ts
 * isUpperSnakeCase("USER_NOT_FOUND"); // true
 * isUpperSnakeCase("ERROR_404");      // true
 * isUpperSnakeCase("userNotFound");   // false
 * isUpperSnakeCase("_USER");          // false
 * isUpperSnakeCase("USER__NOT");      // false
 * isUpperSnakeCase("1ERROR");         // false
 * ```
 */
export function isUpperSnakeCase(value: string) {
	return UPPER_SNAKE_CASE.test(value);
}

/**
 * Monta a mensagem de erro exibida quando um código não está em
 * UPPER_SNAKE_CASE.
 *
 * O retorno é tipado como {@link InvalidCodeMessage}, de modo que o texto em
 * runtime corresponde exatamente ao tipo literal usado na validação em tempo
 * de compilação.
 *
 * @template Code - Tipo literal do código inválido.
 * @param code - Código de erro inválido a ser incluído na mensagem.
 * @returns Mensagem descrevendo o código inválido e o formato esperado.
 *
 * @example
 * ```ts
 * invalidCodeMessage("userNotFound");
 * // 'Código de erro inválido "userNotFound". Os códigos de erro devem usar UPPER_SNAKE_CASE.'
 * ```
 */
export function invalidCodeMessage<Code extends string>(
	code: Code,
): InvalidCodeMessage<Code> {
	return `Código de erro inválido "${code}". Os códigos de erro devem usar UPPER_SNAKE_CASE.`;
}
