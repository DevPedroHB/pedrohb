import type { PartialPick } from "./partial-pick";

/**
 * Torna as propriedades especificadas em `K` opcionais, mantendo as demais inalteradas.
 * @template T - Tipo do objeto base.
 * @template K - Conjunto de chaves de T que serão opcionais.
 */
export type Optional<T, K extends keyof T> = PartialPick<T, K> & Omit<T, K>;
