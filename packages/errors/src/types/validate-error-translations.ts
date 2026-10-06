import type { DefaultParamDelimiters } from "#/functions/create-param-placeholder.js";
import type { CatalogCode } from "./catalog-code.js";
import type { CatalogDescriptor } from "./catalog-descriptor.js";
import type { ErrorCatalog } from "./error-catalog.js";
import type { ErrorParamDelimiters } from "./error-param-delimiters.js";
import type { ExtractPlaceholders } from "./extract-placeholders.js";

/**
 * Mensagem de erro de tipo exibida quando a tradução de um código usa
 * placeholders diferentes dos da mensagem original.
 *
 * @template Code - Código de erro cuja tradução é inválida.
 */
export type InvalidTranslationPlaceholdersMessage<Code extends string> =
	`Os placeholders da tradução de "${Code}" devem ser os mesmos da mensagem original.`;

/**
 * Mensagem de erro de tipo exibida quando um idioma traduz um código que não
 * existe no catálogo.
 *
 * @template Code - Código inexistente no catálogo.
 */
export type UnknownTranslationCodeMessage<Code extends string> =
	`O código "${Code}" não existe no catálogo de erros.`;

/**
 * Indica se duas mensagens possuem exatamente o mesmo conjunto de
 * placeholders (a ordem e as repetições não importam).
 *
 * Quando alguma das mensagens não é um literal (tipo `string` genérico) a
 * comparação é impossível em tempo de compilação e o resultado é `true`; a
 * validação em runtime de `defineErrorTranslations` cobre esse caso.
 *
 * @template Original - Mensagem original do catálogo.
 * @template Translated - Mensagem traduzida.
 * @template Delimiters - Delimitadores dos placeholders. Por padrão,
 * {@link DefaultParamDelimiters}.
 *
 * @example
 * ```ts
 * type A = HasSamePlaceholders<"Usuário {id}", "User {id}">; // true
 * type B = HasSamePlaceholders<"Usuário {id}", "User {userId}">; // false
 * type C = HasSamePlaceholders<"Token inválido", "Invalid token">; // true
 * ```
 */
export type HasSamePlaceholders<
	Original extends string,
	Translated extends string,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
> = string extends Original
	? true
	: string extends Translated
		? true
		: [ExtractPlaceholders<Original, Delimiters>] extends [
					ExtractPlaceholders<Translated, Delimiters>,
				]
			? [ExtractPlaceholders<Translated, Delimiters>] extends [
					ExtractPlaceholders<Original, Delimiters>,
				]
				? true
				: false
			: false;

/**
 * Valida em tempo de compilação as traduções de um catálogo.
 *
 * Mantém cada mensagem como está quando ela é válida e a substitui por uma
 * mensagem de erro de tipo explicativa quando:
 * - o código não existe no catálogo ({@link UnknownTranslationCodeMessage});
 * - os placeholders diferem dos da mensagem original
 *   ({@link InvalidTranslationPlaceholdersMessage}).
 *
 * Códigos **ausentes** são barrados pela restrição de `Translations` em
 * `defineErrorTranslations` (cada idioma deve ser um
 * `Record<CatalogCode<Catalog>, string>`).
 *
 * @template Catalog - Catálogo de erros que as traduções devem acompanhar.
 * @template Translations - Traduções indexadas por idioma.
 * @template Delimiters - Delimitadores dos placeholders. Por padrão,
 * {@link DefaultParamDelimiters}.
 */
export type ValidateErrorTranslations<
	Catalog extends ErrorCatalog,
	Translations extends Record<string, Record<string, string>>,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
> = {
	[Locale in keyof Translations]: {
		[Code in keyof Translations[Locale]]: Code extends CatalogCode<Catalog>
			? HasSamePlaceholders<
					CatalogDescriptor<Catalog, Code>["message"],
					Translations[Locale][Code],
					Delimiters
				> extends true
				? Translations[Locale][Code]
				: InvalidTranslationPlaceholdersMessage<Code>
			: UnknownTranslationCodeMessage<Code & string>;
	};
};
