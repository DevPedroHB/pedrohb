import type { CatalogCode } from "./catalog-code.js";
import type { ErrorCatalog } from "./error-catalog.js";

/**
 * Mensagens de **um** idioma para todos os códigos de um catálogo.
 *
 * Todo código do catálogo precisa ter uma mensagem. Os placeholders de cada
 * mensagem devem ser os mesmos da mensagem original do catálogo (ver
 * {@link ValidateErrorTranslations}).
 *
 * @template Catalog - Catálogo de erros cujos códigos são traduzidos. Por
 * padrão, `ErrorCatalog`.
 *
 * @example
 * ```ts
 * type En = ErrorTranslationMessages<typeof ERROR_CODES>;
 * // Readonly<{ USER_NOT_FOUND: string; INVALID_TOKEN: string }>
 * ```
 */
export type ErrorTranslationMessages<
	Catalog extends ErrorCatalog = ErrorCatalog,
> = Readonly<{
	[Code in CatalogCode<Catalog>]: string;
}>;

/**
 * Traduções de um catálogo de erros indexadas pelo idioma.
 *
 * É o formato retornado por `defineErrorTranslations`.
 *
 * @template Catalog - Catálogo de erros cujos códigos são traduzidos. Por
 * padrão, `ErrorCatalog`.
 * @template Locale - União dos idiomas disponíveis (ex.: `"en" | "es"`). Por
 * padrão, qualquer `string`.
 *
 * @example
 * ```ts
 * type T = ErrorTranslations<typeof ERROR_CODES, "en" | "es">;
 * // Readonly<{ en: ErrorTranslationMessages<...>; es: ErrorTranslationMessages<...> }>
 * ```
 */
export type ErrorTranslations<
	Catalog extends ErrorCatalog = ErrorCatalog,
	Locale extends string = string,
> = Readonly<{
	[L in Locale]: ErrorTranslationMessages<Catalog>;
}>;

/**
 * Extrai a união de idiomas de um objeto de traduções.
 *
 * Útil para informar o parâmetro `Locale` de `BaseError` sem repetir os
 * idiomas manualmente.
 *
 * @template Translations - Resultado de `defineErrorTranslations`.
 *
 * @example
 * ```ts
 * const TRANSLATIONS = defineErrorTranslations(ERROR_CODES, { en: {...}, es: {...} });
 *
 * type Locale = ErrorTranslationLocale<typeof TRANSLATIONS>;
 * // "en" | "es"
 * ```
 */
export type ErrorTranslationLocale<
	Translations extends ErrorTranslations = ErrorTranslations,
> = keyof Translations & string;
