/**
 * Transforma propriedades que permitem `null` em propriedades opcionais.
 * As propriedades que não permitem `null` permanecem obrigatórias.
 * @template T - Tipo do objeto base.
 */
export type NullableToOptional<T> = {
	[K in keyof T as null extends T[K] ? K : never]?: T[K];
} & {
	[K in keyof T as null extends T[K] ? never : K]: T[K];
};
