/**
 * Torna as propriedades excluídas em `K` opcionais.
 * @template T - Tipo do objeto base.
 * @template K - Conjunto de chaves de T que serão omitidas e transformadas em opcionais.
 */
export type PartialOmit<T, K extends keyof T> = Partial<Omit<T, K>>;
