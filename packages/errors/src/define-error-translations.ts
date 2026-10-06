import { InvalidErrorTranslation } from "./errors/invalid-error-translation.js";
import {
	DEFAULT_PARAM_DELIMITERS,
	type DefaultParamDelimiters,
} from "./functions/create-param-placeholder.js";
import { extractPlaceholderNames } from "./functions/extract-placeholder-names.js";
import type { CatalogCode } from "./types/catalog-code.js";
import type { ErrorCatalog } from "./types/error-catalog.js";
import type { ErrorParamDelimiters } from "./types/error-param-delimiters.js";
import type { ErrorTranslations } from "./types/error-translations.js";
import type { ValidateErrorTranslations } from "./types/validate-error-translations.js";

/**
 * Cria traduções imutáveis para um catálogo de erros.
 *
 * Recebe o catálogo (cujas mensagens são o idioma padrão) e um objeto que
 * associa cada idioma às mensagens traduzidas de **todos** os códigos. O
 * resultado pode ser repassado a uma subclasse de `BaseError` (campo
 * `translations`) para habilitar `BaseError.translate`.
 *
 * Tanto cada idioma quanto o objeto retornado são congelados com
 * `Object.freeze` e o retorno é uma cópia: alterar o objeto original depois
 * não afeta as traduções.
 *
 * A validação ocorre em duas camadas:
 * - em tempo de compilação via {@link ValidateErrorTranslations}: faltar um
 *   código, traduzir um código que não existe ou usar placeholders
 *   diferentes dos da mensagem original geram erros de tipo;
 * - em tempo de execução: as mesmas verificações lançam
 *   {@link InvalidErrorTranslation} protegendo contra definições que
 *   escapem da checagem de tipos (ex.: objetos tipados como `any`).
 *
 * Os placeholders são comparados como conjuntos de nomes (aparados e sem
 * repetição), então a ordem em que aparecem na tradução pode mudar.
 *
 * @template Catalog - Catálogo de erros que será traduzido.
 * @template Translations - Objeto que mapeia cada idioma às mensagens
 * traduzidas.
 * @template Delimiters - Delimitadores dos placeholders do catálogo. Por
 * padrão, {@link DefaultParamDelimiters}.
 * @param catalog - Catálogo criado com `defineErrorCatalog`.
 * @param translations - Mensagens traduzidas por idioma.
 * @param delimiters - Delimitadores `open` e `close` dos placeholders.
 * Informe-os apenas se o erro usa delimitadores diferentes de `{` e `}`
 * (os mesmos passados em `options.delimiters` de `BaseError`).
 * @returns Traduções somente leitura, indexadas por idioma.
 * @throws {InvalidErrorTranslation} Se faltar a tradução de algum código, se
 * houver um código que não existe no catálogo ou se os placeholders de uma
 * tradução diferirem dos da mensagem original.
 * @throws {InvalidParamDelimitersError} Se algum dos delimitadores for uma
 * string vazia.
 *
 * @example
 * ```ts
 * const ERROR_CODES = defineErrorCatalog({
 *   USER_NOT_FOUND: "Usuário {id} não encontrado",
 *   INVALID_TOKEN: "Token inválido",
 * });
 *
 * const ERROR_TRANSLATIONS = defineErrorTranslations(ERROR_CODES, {
 *   en: {
 *     USER_NOT_FOUND: "User {id} not found",
 *     INVALID_TOKEN: "Invalid token",
 *   },
 *   es: {
 *     USER_NOT_FOUND: "Usuario {id} no encontrado",
 *     INVALID_TOKEN: "Token inválido",
 *   },
 * });
 *
 * ERROR_TRANSLATIONS.en.USER_NOT_FOUND; // "User {id} not found"
 *
 * // Erros de compilação (e de execução):
 * defineErrorTranslations(ERROR_CODES, {
 *   en: { USER_NOT_FOUND: "User {userId} not found" }, // placeholder diferente
 * }); // e falta INVALID_TOKEN
 * ```
 */
export function defineErrorTranslations<
	const Catalog extends ErrorCatalog,
	const Translations extends Record<
		string,
		Record<CatalogCode<Catalog>, string>
	>,
	const Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
>(
	catalog: Catalog,
	translations: ValidateErrorTranslations<Catalog, Translations, Delimiters>,
	delimiters?: Delimiters,
): ErrorTranslations<Catalog, keyof Translations & string> {
	const resolvedDelimiters = delimiters ?? DEFAULT_PARAM_DELIMITERS;
	const original = Object.entries(catalog).map(
		([code, descriptor]) =>
			[
				code,
				extractPlaceholderNames(descriptor.message, resolvedDelimiters),
			] as const,
	);
	const localized: [string, Readonly<Record<string, string>>][] = [];

	for (const [locale, messages] of Object.entries(
		translations as Record<string, Record<string, string>>,
	)) {
		for (const code of Object.keys(messages)) {
			if (!Object.hasOwn(catalog, code)) {
				throw new InvalidErrorTranslation(locale, code, "unknown");
			}
		}

		const entries: [string, string][] = [];

		for (const [code, placeholders] of original) {
			const message = Object.hasOwn(messages, code)
				? messages[code]
				: undefined;

			if (typeof message !== "string") {
				throw new InvalidErrorTranslation(locale, code, "missing");
			}

			const translated = extractPlaceholderNames(message, resolvedDelimiters);

			if (
				translated.size !== placeholders.size ||
				![...translated].every((name) => placeholders.has(name))
			) {
				throw new InvalidErrorTranslation(locale, code, "placeholders");
			}

			entries.push([code, message]);
		}

		localized.push([locale, Object.freeze(Object.fromEntries(entries))]);
	}

	return Object.freeze(
		Object.fromEntries(localized),
	) as unknown as ErrorTranslations<Catalog, keyof Translations & string>;
}
