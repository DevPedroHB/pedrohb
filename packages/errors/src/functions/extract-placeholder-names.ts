import type { ErrorParamDelimiters } from "#/types/error-param-delimiters.js";
import {
	createParamPlaceholder,
	DEFAULT_PARAM_DELIMITERS,
} from "./create-param-placeholder.js";

/**
 * Extrai em tempo de execução os nomes dos placeholders de uma mensagem.
 *
 * É o equivalente em runtime do tipo `ExtractPlaceholders`: os nomes são
 * aparados (`{ id }` equivale a `{id}`) e placeholders com nome vazio (ex.:
 * `{}` ou `{   }`) são ignorados. Nomes repetidos aparecem apenas uma vez.
 *
 * @param message - Mensagem a ser analisada.
 * @param delimiters - Delimitadores `open` e `close` dos placeholders. Por
 * padrão, {@link DEFAULT_PARAM_DELIMITERS}.
 * @returns Conjunto com os nomes dos placeholders na ordem em que aparecem.
 * @throws {InvalidParamDelimitersError} Se `open` ou `close` for uma string
 * vazia (lançado por {@link createParamPlaceholder}).
 *
 * @example
 * ```ts
 * extractPlaceholderNames("Usuário {id} não encontrado em { table }, {}");
 * // Set { "id", "table" }
 *
 * extractPlaceholderNames("Rota [route]", { open: "[", close: "]" });
 * // Set { "route" }
 * ```
 */
export function extractPlaceholderNames(
	message: string,
	delimiters: ErrorParamDelimiters = DEFAULT_PARAM_DELIMITERS,
) {
	const names = new Set<string>();

	for (const match of message.matchAll(createParamPlaceholder(delimiters))) {
		const name = (match[1] ?? "").trim();

		if (name !== "") {
			names.add(name);
		}
	}

	return names;
}
