/**
 * Define a ordem de classificação para as propriedades de um objeto.
 * Cada chave de T pode ser ordenada de forma ascendente ("asc") ou descendente ("desc").
 * @template T - Tipo do objeto base.
 */
export type SortOrder<T> = Partial<{
	[key in keyof T]: "asc" | "desc";
}>;
