import type { CatalogCode } from "./catalog-code.js";
import type { ErrorCatalog } from "./error-catalog.js";

/**
 * Obtém o descritor de erro correspondente a um código específico de um
 * catálogo.
 *
 * Busca em `Catalog` a entrada cujo `code` é `Code` e retorna o respectivo
 * `ErrorDescriptor`, com `code` e `message` em seus tipos literais. Se `Code`
 * for uma união de códigos, o resultado é a união dos descritores
 * correspondentes. Se `Code` não for informado, o resultado é a união de todos
 * os descritores do catálogo.
 *
 * @template Catalog - Catálogo de erros a ser consultado. Por padrão,
 * `ErrorCatalog`.
 * @template Code - Código (ou união de códigos) a ser buscado, restrito aos
 * códigos existentes no catálogo (ver {@link CatalogCode}). Por padrão, todos
 * os códigos do catálogo.
 *
 * @example
 * ```ts
 * type TEST_ERROR_CODES = ErrorCatalog<{
 *   USER_NOT_FOUND: "Usuário {id} não encontrado";
 *   INVALID_TOKEN: "Token inválido";
 * }>;
 *
 * type A = CatalogDescriptor<TEST_ERROR_CODES, "USER_NOT_FOUND">;
 * // ErrorDescriptor<"USER_NOT_FOUND", "Usuário {id} não encontrado">
 *
 * type B = CatalogDescriptor<TEST_ERROR_CODES, "USER_NOT_FOUND" | "INVALID_TOKEN">;
 * // ErrorDescriptor<"USER_NOT_FOUND", ...> | ErrorDescriptor<"INVALID_TOKEN", ...>
 *
 * type C = CatalogDescriptor<TEST_ERROR_CODES>;
 * // união de todos os descritores do catálogo
 * ```
 */
export type CatalogDescriptor<
	Catalog extends ErrorCatalog = ErrorCatalog,
	Code extends CatalogCode<Catalog> = CatalogCode<Catalog>,
> = Extract<Catalog[Code], { code: Code }>;
