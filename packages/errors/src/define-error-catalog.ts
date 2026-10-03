import { InvalidErrorCode } from "./errors/invalid-error-code.js";
import type { ErrorCatalog } from "./types/error-catalog.js";
import type { ErrorDescriptor } from "./types/error-descriptor.js";
import type { ValidateErrorDefinitions } from "./types/validate-error-definitions.js";
import { isUpperSnakeCase } from "./upper-snake-case.js";

/**
 * Cria um catálogo de erros imutável a partir de um objeto que associa cada
 * código de erro à sua mensagem.
 *
 * Para cada entrada de `definitions` gera um {@link ErrorDescriptor} com
 * `code` e `message` congelado com `Object.freeze`. O próprio catálogo
 * retornado também é congelado, de modo que nem o catálogo nem seus
 * descritores podem ser alterados depois de criados.
 *
 * A validação ocorre em duas camadas:
 * - em tempo de compilação via {@link ValidateErrorDefinitions}: códigos fora
 *   de UPPER_SNAKE_CASE geram um erro de tipo com uma mensagem explicativa;
 * - em tempo de execução via {@link isUpperSnakeCase}: códigos inválidos
 *   lançam {@link InvalidErrorCode}, o que protege contra definições que
 *   escapem da checagem de tipos (ex.: objetos tipados como `any` ou
 *   `Record<string, string>`).
 *
 * O parâmetro de tipo `T` é declarado como `const`, o que preserva os tipos
 * literais dos códigos e das mensagens sem a necessidade de `as const` na
 * chamada.
 *
 * @template Codes - Objeto que mapeia códigos de erro para suas mensagens.
 * @param definitions - Definições do catálogo: chaves são os códigos em
 * UPPER_SNAKE_CASE.
 * @returns Catálogo de erros somente leitura com um descritor para cada
 * código informado.
 * @throws {InvalidErrorCode} Se algum código não estiver em UPPER_SNAKE_CASE.
 *
 * @example
 * ```ts
 * const TEST_ERROR_CODES = defineErrorCatalog({
 *   USER_NOT_FOUND: "Usuário {id} não encontrado",
 *   INVALID_TOKEN: "Token inválido",
 * });
 *
 * TEST_ERROR_CODES.USER_NOT_FOUND.code;    // "USER_NOT_FOUND"
 * TEST_ERROR_CODES.USER_NOT_FOUND.message; // "Usuário {id} não encontrado"
 *
 * // Erro de compilação (e de execução): código fora de UPPER_SNAKE_CASE
 * defineErrorCatalog({
 *   userNotFound: "Usuário não encontrado",
 * });
 * // Lança InvalidErrorCode
 * ```
 */
export function defineErrorCatalog<const Codes extends Record<string, string>>(
	definitions: ValidateErrorDefinitions<Codes>,
): ErrorCatalog<Codes> {
	const catalog: Record<string, ErrorDescriptor> = {};

	for (const [code, message] of Object.entries(
		definitions as Record<string, string>,
	)) {
		if (!isUpperSnakeCase(code)) {
			throw new InvalidErrorCode(code);
		}

		catalog[code] = Object.freeze({ code, message });
	}

	return Object.freeze(catalog) as ErrorCatalog<Codes>;
}
