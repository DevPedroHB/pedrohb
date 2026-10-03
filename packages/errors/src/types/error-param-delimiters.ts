/**
 * Delimitadores de abertura e fechamento usados para identificar os
 * placeholders em uma mensagem de erro (ex.: `{id}`). Também pode
 * ser usado para tipar, em runtime, o objeto de delimitadores.
 *
 * Os parâmetros de tipo têm `string` como padrão, de modo que
 * `ErrorParamDelimiters` sem argumentos serve como restrição genérica
 * (`extends ErrorParamDelimiters`) aceitando quaisquer delimitadores. Para o
 * par padrão `{` e `}`, informe os literais explicitamente.
 *
 * @template Open - Tipo literal do delimitador de abertura. Por padrão, `string`.
 * @template Close - Tipo literal do delimitador de fechamento. Por padrão, `string`.
 *
 * @example
 * ```ts
 * const keys = { open: "{", close: "}" } as const satisfies ErrorParamDelimiters;
 *
 * const brackets: ErrorParamDelimiters<"[", "]"> = {
 *   open: "[",
 *   close: "]",
 * };
 * // Mensagem correspondente: "Usuário [id] não encontrado"
 * ```
 */
export type ErrorParamDelimiters<
	Open extends string = string,
	Close extends string = string,
> = Readonly<{
	/** Delimitador que marca o início de um placeholder (ex.: `"{"`). */
	open: Open;
	/** Delimitador que marca o fim de um placeholder (ex.: `"}"`). */
	close: Close;
}>;
