import type { DefaultParamDelimiters } from "#/functions/create-param-placeholder.js";
import type { ErrorParamDelimiters } from "./error-param-delimiters.js";
import type { ExtractPlaceholders } from "./extract-placeholders.js";

/**
 * Valores aceitos como parâmetros para preencher os placeholders de uma
 * mensagem de erro.
 *
 * Restringe-se a tipos primitivos simples e serializáveis, o que evita
 * objetos arbitrários e referências circulares nos parâmetros do erro.
 */
export type ErrorParamValue = string | number | boolean | bigint | null;

/**
 * Deriva em tempo de compilação, o tipo do objeto de parâmetros exigido por
 * uma mensagem com base nos placeholders presentes nela.
 *
 * Cada placeholder encontrado (via {@link ExtractPlaceholders}) vira uma
 * propriedade obrigatória e somente leitura do tipo {@link ErrorParamValue}.
 * Os delimitadores dos placeholders são informados por meio de um objeto
 * {@link ErrorParamDelimiters}.
 *
 * - Se a mensagem **não** tiver placeholders o resultado é `never`, indicando
 *   que nenhum parâmetro deve ser informado.
 * - Se `Message` for o tipo genérico `string` (não literal), não é possível
 *   inferir os placeholders e o resultado é um objeto com chaves `string`
 *   arbitrárias, ou seja, `Readonly<Record<string, ErrorParamValue>>`.
 *
 * @template Message - Mensagem a ser analisada. Por padrão, `string`.
 * @template Delimiters - Objeto com os delimitadores `open` e `close` do
 * placeholder. Por padrão, {@link DefaultParamDelimiters}.
 *
 * @example
 * ```ts
 * type Keys = { readonly open: "{"; readonly close: "}" };
 *
 * type A = ParamsFromMessage<"Usuário {id} não encontrado em {table}", Keys>;
 * // Readonly<{ id: ErrorParamValue; table: ErrorParamValue }>
 *
 * type B = ParamsFromMessage<"Algo deu errado", Keys>;
 * // never (sem placeholders, sem parâmetros)
 *
 * type C = ParamsFromMessage<
 *   "Falha em [resource]",
 *   { readonly open: "["; readonly close: "]" }
 * >;
 * // Readonly<{ resource: ErrorParamValue }>
 *
 * type D = ParamsFromMessage<string, Keys>;
 * // Readonly<Record<string, ErrorParamValue>>
 * ```
 */
export type ParamsFromMessage<
	Message extends string = string,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
> = [ExtractPlaceholders<Message, Delimiters>] extends [never]
	? never
	: Readonly<{
			[K in ExtractPlaceholders<Message, Delimiters>]: ErrorParamValue;
		}>;
