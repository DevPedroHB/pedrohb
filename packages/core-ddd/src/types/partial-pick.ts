/**
 * Seleciona as propriedades especificadas em `K` de T e as torna opcionais.
 * @template T - Tipo do objeto base.
 * @template K - Conjunto de chaves de T que serão selecionadas como opcionais.
 */
export type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;
