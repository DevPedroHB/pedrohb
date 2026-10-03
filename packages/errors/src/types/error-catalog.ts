import type { ErrorDescriptor } from "./error-descriptor.js";

/**
 * Catálogo de erros somente leitura, derivado de um objeto que associa cada
 * código de erro à sua mensagem.
 *
 * Para cada entrada de `Definitions`, a chave vira o `code` e o valor vira a
 * `message` de um {@link ErrorDescriptor}, preservando os tipos literais de
 * ambos. Assim, `TEST_ERROR_CODES.USER_NOT_FOUND.code` tem o tipo `"USER_NOT_FOUND"`
 * e `TEST_ERROR_CODES.USER_NOT_FOUND.message` tem o tipo literal da mensagem definida.
 *
 * Apenas chaves do tipo `string` são consideradas.
 *
 * @template Definitions - Objeto que mapeia códigos de erro para suas
 * mensagens. Por padrão, `Record<string, string>`.
 *
 * @example
 * ```ts
 * type TEST_ERROR_CODES = ErrorCatalog<{
 *   USER_NOT_FOUND: "Usuário {id} não encontrado";
 *   INVALID_TOKEN: "Token inválido";
 * }>;
 * // {
 * //   readonly USER_NOT_FOUND: ErrorDescriptor<"USER_NOT_FOUND", "Usuário {id} não encontrado">;
 * //   readonly INVALID_TOKEN: ErrorDescriptor<"INVALID_TOKEN", "Token inválido">;
 * // }
 * ```
 */
export type ErrorCatalog<
	Definitions extends Record<string, string> = Record<string, string>,
> = Readonly<{
	[Code in keyof Definitions & string]: ErrorDescriptor<
		Code,
		Definitions[Code]
	>;
}>;
