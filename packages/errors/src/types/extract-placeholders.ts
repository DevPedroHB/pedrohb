import type { DefaultParamDelimiters } from "#/functions/create-param-placeholder.js";
import type { ErrorParamDelimiters } from "./error-param-delimiters.js";

/**
 * Caracteres de espaço em branco reconhecidos pelos tipos utilitários deste módulo.
 *
 * Inclui espaço, tabulação, quebra de linha (`\n`) e retorno de carro (`\r`).
 */
export type Whitespace = " " | "\t" | "\n" | "\r";

/**
 * Remove, em tempo de compilação, todos os espaços em branco no início e no fim
 * de uma string literal. É o equivalente em nível de tipos a `String.prototype.trim()`.
 *
 * O tipo é recursivo: remove um caractere de espaço por vez do início e
 * quando não há mais nenhum, do fim até restar apenas o conteúdo "limpo".
 *
 * @template T - Tipo string literal a ser aparado. Por padrão, `string`.
 *
 * @example
 * ```ts
 * type A = Trim<"  olá  ">;   // "olá"
 * type B = Trim<"\n\tabc\r">; // "abc"
 * type C = Trim<"sem-espaço">; // "sem-espaço"
 * type D = Trim<string>;       // string
 * ```
 */
export type Trim<T extends string = string> =
	T extends `${Whitespace}${infer Rest}`
		? Trim<Rest>
		: T extends `${infer Rest}${Whitespace}`
			? Trim<Rest>
			: T;

/**
 * Extrai, em tempo de compilação, os nomes dos placeholders presentes em uma
 * string de mensagem, retornando-os como uma união de string literals.
 *
 * Os delimitadores de abertura e fechamento são informados por meio de um
 * objeto {@link ErrorParamDelimiters}. O conteúdo de cada placeholder é
 * aparado com {@link Trim} e placeholders vazios (ex.: `{}` ou `{   }`) são
 * ignorados.
 *
 * Se `Message` for o tipo genérico `string` (ou seja, não for um literal),
 * não é possível inferir os placeholders e o resultado é `string`. Se a
 * mensagem não contiver nenhum placeholder, o resultado é `never`.
 *
 *
 * @template Message - Mensagem a ser analisada. Por padrão, `string`.
 * @template Delimiters - Objeto com os delimitadores `open` e `close` do
 * placeholder. Por padrão, {@link DefaultParamDelimiters}.
 *
 * @example
 * ```ts
 * type Keys = { readonly open: "{"; readonly close: "}" };
 *
 * type A = ExtractPlaceholders<"Olá, {nome}! Você tem {qtd} mensagens.", Keys>;
 * // "nome" | "qtd"
 *
 * type B = ExtractPlaceholders<"Valor: { valor }", Keys>;
 * // "valor" (espaços internos são removidos)
 *
 * type C = ExtractPlaceholders<"Sem placeholders", Keys>;
 * // never
 *
 * type D = ExtractPlaceholders<"Olá, {}!", Keys>;
 * // never (placeholder vazio é ignorado)
 *
 * type E = ExtractPlaceholders<
 *   "Olá, [nome]!",
 *   { readonly open: "["; readonly close: "]" }
 * >;
 * // "nome" (delimitadores personalizados)
 *
 * type F = ExtractPlaceholders<string, Keys>;
 * // string (mensagem não literal)
 * ```
 */
export type ExtractPlaceholders<
	Message extends string = string,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
> = string extends Message
	? string
	: Message extends `${string}${Delimiters["open"]}${infer Param}${Delimiters["close"]}${infer Rest}`
		? Trim<Param> extends ""
			? ExtractPlaceholders<Rest, Delimiters>
			: Trim<Param> | ExtractPlaceholders<Rest, Delimiters>
		: never;
