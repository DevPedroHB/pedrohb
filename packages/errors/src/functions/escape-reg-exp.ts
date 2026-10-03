/**
 * Escapa os caracteres especiais de expressões regulares em uma string, para
 * que ela possa ser usada como texto literal dentro de um `RegExp`.
 *
 * Cada caractere especial (`. * + ? ^ $ { } ( ) | [ ] \`) é precedido por uma
 * barra invertida. Caracteres comuns permanecem inalterados.
 *
 * Útil por exemplo, para montar uma expressão regular a partir de
 * delimitadores informados pelo usuário (como os de placeholders), sem que
 * símbolos como `[` ou `{` sejam interpretados como parte da sintaxe.
 *
 * @param value - String a ser escapada.
 * @returns A string com os caracteres especiais escapados.
 *
 * @example
 * ```ts
 * escapeRegExp("{id}");        // "\\{id\\}"
 * escapeRegExp("[nome]");      // "\\[nome\\]"
 * escapeRegExp("a.b*c");       // "a\\.b\\*c"
 * escapeRegExp("texto livre"); // "texto livre"
 *
 * const regex = new RegExp(escapeRegExp("(x)"), "g");
 * "valor (x) aqui".replace(regex, "1"); // "valor 1 aqui"
 * ```
 */
export function escapeRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
