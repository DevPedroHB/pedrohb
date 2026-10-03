import { InvalidParamDelimitersError } from "#/errors/invalid-param-delimiters-error.js";
import type { ErrorParamDelimiters } from "#/types/error-param-delimiters.js";
import { escapeRegExp } from "./escape-reg-exp.js";

/**
 * Delimitadores padrão dos placeholders em mensagens de erro: `{` para abrir
 * e `}` para fechar (ex.: `{id}`).
 *
 * Declarado com `as const`, então mantém os tipos literais `"{"` e `"}"`,
 * o que permite derivar {@link DefaultParamDelimiters} a partir dele.
 */
export const DEFAULT_PARAM_DELIMITERS = {
	open: "{",
	close: "}",
} as const satisfies ErrorParamDelimiters;

/**
 * Tipo dos delimitadores padrão equivalente a
 * `{ readonly open: "{"; readonly close: "}" }`.
 *
 * É usado como valor padrão de `Delimiters` em tipos como `ErrorParams`.
 */
export type DefaultParamDelimiters = typeof DEFAULT_PARAM_DELIMITERS;

/**
 * Cria uma expressão regular global que localiza os placeholders de uma
 * mensagem de erro com base nos delimitadores informados.
 *
 * Os delimitadores são escapados com {@link escapeRegExp}, então símbolos como
 * `[`, `(` ou `$` são tratados como texto literal. Delimitadores com mais de
 * um caractere (ex.: `{{` e `}}`) também são aceitos.
 *
 * Em cada correspondência o grupo de captura `1` contém o texto entre os
 * delimitadores, exatamente como aparece na mensagem (sem aparar espaços).
 * O conteúdo pode ocupar várias linhas, mas não pode conter os delimitadores
 * de abertura ou de fechamento. Em casos como `{{id}}` a correspondência
 * recai sobre o par mais interno (`{id}`). Placeholders vazios (ex.: `{}`)
 * também correspondem com o grupo `1` igual a `""`.
 *
 * Cada chamada devolve uma nova instância de `RegExp`. Como ela usa a flag
 * `g` que mantém estado em `lastIndex`, isso evita que usos diferentes
 * compartilhem o mesmo estado.
 *
 * @param delimiters - Delimitadores `open` e `close` do placeholder. Por
 * padrão, {@link DEFAULT_PARAM_DELIMITERS} (`{` e `}`).
 * @returns Expressão regular global que corresponde a cada placeholder.
 * @throws {InvalidParamDelimitersError} Se `open` ou `close` for uma string
 * vazia.
 *
 * @example
 * ```ts
 * const regex = createParamPlaceholder();
 *
 * for (const match of "Usuário {id} não encontrado em {table}".matchAll(regex)) {
 *   console.log(match[1]);
 * }
 * // "id"
 * // "table"
 *
 * "Olá, {nome}!".replace(regex, (_, param) => `<${param}>`);
 * // "Olá, <nome>!"
 *
 * // Delimitadores personalizados
 * const brackets = createParamPlaceholder({ open: "[", close: "]" });
 * "Rota [route] não encontrada".match(brackets); // ["[route]"]
 *
 * // Delimitadores vazios não são permitidos
 * createParamPlaceholder({ open: "", close: "}" });
 * // Lança InvalidParamDelimitersError
 * ```
 */
export function createParamPlaceholder(
	delimiters: ErrorParamDelimiters = DEFAULT_PARAM_DELIMITERS,
) {
	const { open, close } = delimiters;

	if (open === "" || close === "") {
		throw new InvalidParamDelimitersError();
	}

	const o = escapeRegExp(open);
	const c = escapeRegExp(close);

	return new RegExp(`${o}((?:(?!${o}|${c})[\\s\\S])*)${c}`, "g");
}
