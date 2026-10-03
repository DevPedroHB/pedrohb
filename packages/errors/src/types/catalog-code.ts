import type { ErrorCatalog } from "./error-catalog.js";
import type { ErrorDescriptor } from "./error-descriptor.js";

/**
 * Extrai a união de todos os códigos de erro presentes em um catálogo.
 *
 * Percorre cada {@link ErrorDescriptor} do catálogo e coleta o tipo literal de
 * sua propriedade `code`. Útil para tipar parâmetros que aceitam apenas
 * códigos válidos de um catálogo específico.
 *
 * @template Catalog - Catálogo de erros a ser analisado. Por padrão,
 * `ErrorCatalog`, caso em que o resultado é `string`.
 *
 * @example
 * ```ts
 * type TEST_ERROR_CODES = ErrorCatalog<{
 *   USER_NOT_FOUND: "Usuário {id} não encontrado";
 *   INVALID_TOKEN: "Token inválido";
 * }>;
 *
 * type TestErrorCatalogCode = CatalogCode<TEST_ERROR_CODES>;
 * // "USER_NOT_FOUND" | "INVALID_TOKEN"
 * ```
 */
export type CatalogCode<Catalog extends ErrorCatalog = ErrorCatalog> =
	Catalog[keyof Catalog]["code"];
