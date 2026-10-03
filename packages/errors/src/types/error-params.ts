import type { DefaultParamDelimiters } from "#/functions/create-param-placeholder.js";
import type { CatalogCode } from "./catalog-code.js";
import type { CatalogDescriptor } from "./catalog-descriptor.js";
import type { ErrorCatalog } from "./error-catalog.js";
import type { ErrorParamDelimiters } from "./error-param-delimiters.js";
import type { ParamsFromMessage } from "./params-from-message.js";

/**
 * Deriva em tempo de compilação, o tipo do objeto de parâmetros exigido para
 * criar o erro de um código específico de um catálogo.
 *
 * Localiza o descritor do código em `Catalog` (via {@link CatalogDescriptor}),
 * lê sua `message` e converte os placeholders encontrados em propriedades
 * obrigatórias (via {@link ParamsFromMessage}). Os delimitadores dos
 * placeholders são informados por meio de um objeto
 * {@link ErrorParamDelimiters}.
 *
 * - Se a mensagem do código **não** tiver placeholders, o resultado é `never`,
 *   indicando que nenhum parâmetro deve ser informado.
 * - Se `Code` for uma união de códigos, o resultado exige os placeholders de
 *   todas as mensagens correspondentes, e não apenas os de uma delas.
 *
 * @template Catalog - Catálogo de erros a ser consultado. Por padrão,
 * `ErrorCatalog`.
 * @template Code - Código (ou união de códigos) do erro, restrito aos códigos
 * existentes no catálogo (ver {@link CatalogCode}). Por padrão, todos os
 * códigos do catálogo.
 * @template Delimiters - Objeto com os delimitadores `open` e `close` do
 * placeholder. Por padrão, {@link DefaultParamDelimiters}.
 *
 * @example
 * ```ts
 * type TEST_ERROR_CODES = ErrorCatalog<{
 *   USER_NOT_FOUND: "Usuário {id} não encontrado em {tabela}";
 *   INVALID_TOKEN: "Token inválido";
 *   ROUTE_NOT_FOUND: "Rota [rota] não encontrada";
 * }>;
 *
 * type A = ErrorParams<TEST_ERROR_CODES, "USER_NOT_FOUND">;
 * // Readonly<{ id: ErrorParamValue; tabela: ErrorParamValue }>
 *
 * type B = ErrorParams<TEST_ERROR_CODES, "INVALID_TOKEN">;
 * // never (sem placeholders, sem parâmetros)
 *
 * type C = ErrorParams<
 *   TEST_ERROR_CODES,
 *   "ROUTE_NOT_FOUND",
 *   { readonly open: "["; readonly close: "]" }
 * >;
 * // Readonly<{ rota: ErrorParamValue }> (delimitadores personalizados)
 * ```
 */
export type ErrorParams<
	Catalog extends ErrorCatalog = ErrorCatalog,
	Code extends CatalogCode<Catalog> = CatalogCode<Catalog>,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
> = ParamsFromMessage<CatalogDescriptor<Catalog, Code>["message"], Delimiters>;
