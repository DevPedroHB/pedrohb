import {
	createParamPlaceholder,
	type DefaultParamDelimiters,
} from "./functions/create-param-placeholder.js";
import type { ErrorDescriptor } from "./types/error-descriptor.js";
import type { ErrorParamDelimiters } from "./types/error-param-delimiters.js";
import type {
	ErrorParamValue,
	ParamsFromMessage,
} from "./types/params-from-message.js";

/**
 * Deriva, em tempo de compilação a lista de argumentos extras exigida para
 * interpolar uma mensagem de erro.
 *
 * - Se a mensagem **não** tiver placeholders o resultado é uma tupla vazia
 *   (`[]`), ou seja, nenhum argumento adicional deve ser passado.
 * - Se tiver placeholders o resultado é uma tupla com um único argumento
 *   obrigatório, `params` do tipo {@link ParamsFromMessage}.
 *
 * É pensado para ser usado como tipo de parâmetro rest (`...args`) de modo
 * que o objeto de parâmetros seja exigido apenas quando necessário.
 *
 * @template Message - Mensagem a ser analisada.
 * @template Delimiters - Objeto com os delimitadores `open` e `close` do
 * placeholder. Por padrão, {@link DefaultParamDelimiters}.
 *
 * @example
 * ```ts
 * type A = ErrorMessageArgs<"Usuário {id} não encontrado">;
 * // [params: Readonly<{ id: ErrorParamValue }>]
 *
 * type B = ErrorMessageArgs<"Token inválido">;
 * // []
 *
 * type C = ErrorMessageArgs<
 *   "Rota [route] não encontrada",
 *   { readonly open: "["; readonly close: "]" }
 * >;
 * // [params: Readonly<{ route: ErrorParamValue }>]
 * ```
 */
export type ErrorMessageArgs<
	Message extends string,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
> = [ParamsFromMessage<Message, Delimiters>] extends [never]
	? []
	: [params: ParamsFromMessage<Message, Delimiters>];

/**
 * Interpola os parâmetros informados na mensagem de um descritor de erro
 * substituindo cada placeholder pelo valor correspondente.
 *
 * Os placeholders são localizados com {@link createParamPlaceholder} a partir
 * dos delimitadores informados. O nome de cada placeholder é aparado
 * (`{ id }` equivale a `{id}`) e o valor é convertido para texto com `String`.
 *
 * O placeholder é mantido exatamente como está na mensagem (sem substituição)
 * quando:
 * - o nome é vazio (ex.: `{}` ou `{   }`);
 * - o nome não existe como propriedade própria de `params`.
 *
 * O objeto de parâmetros é exigido ou omitido conforme a mensagem via
 * {@link ErrorMessageArgs}: mensagens sem placeholders não aceitam `params` e
 * mensagens com placeholders exigem todos eles.
 *
 * @template Descriptor - Tipo do descritor de erro cuja `message` define os
 * parâmetros exigidos.
 * @template Delimiters - Tipo dos delimitadores dos placeholders. Por padrão,
 * {@link DefaultParamDelimiters}.
 * @param descriptor - Descritor de erro cuja mensagem será interpolada.
 * @param delimiters - Delimitadores `open` e `close` dos placeholders.
 * @param args - Objeto `params` com os valores dos placeholders exigido
 * apenas se a mensagem tiver placeholders.
 * @returns A mensagem com os placeholders substituídos.
 * @throws {InvalidParamDelimitersError} Se `open` ou `close` for uma string
 * vazia (lançado por {@link createParamPlaceholder}).
 *
 * @example
 * ```ts
 * const keys = { open: "{", close: "}" } as const;
 *
 * const USER_NOT_FOUND = {
 *   code: "USER_NOT_FOUND",
 *   message: "Usuário {id} não encontrado em {table}",
 * } as const satisfies ErrorDescriptor;
 *
 * interpolateErrorMessage(USER_NOT_FOUND, keys, {
 *   id: 42,
 *   table: "users",
 * });
 * // "Usuário 42 não encontrado em users"
 *
 * const INVALID_TOKEN = {
 *   code: "INVALID_TOKEN",
 *   message: "Token inválido",
 * } as const satisfies ErrorDescriptor;
 *
 * interpolateErrorMessage(INVALID_TOKEN, keys);
 * // "Token inválido" (sem params)
 *
 * // Delimitadores personalizados
 * const ROUTE_NOT_FOUND = {
 *   code: "ROUTE_NOT_FOUND",
 *   message: "Rota [route] não encontrada",
 * } as const satisfies ErrorDescriptor;
 *
 * interpolateErrorMessage(
 *   ROUTE_NOT_FOUND,
 *   { open: "[", close: "]" } as const,
 *   { route: "/home" },
 * );
 * // "Rota /home não encontrada"
 * ```
 */
export function interpolateErrorMessage<
	Descriptor extends ErrorDescriptor,
	Delimiters extends ErrorParamDelimiters = DefaultParamDelimiters,
>(
	descriptor: Descriptor,
	delimiters: Delimiters,
	...args: ErrorMessageArgs<Descriptor["message"], Delimiters>
) {
	const params = (args[0] ?? {}) as Record<string, ErrorParamValue>;
	const placeholder = createParamPlaceholder(delimiters);

	return descriptor.message.replace(placeholder, (match, rawKey: string) => {
		const key = rawKey.trim();

		if (key === "" || !Object.hasOwn(params, key)) {
			return match;
		}

		return String(params[key]);
	});
}
