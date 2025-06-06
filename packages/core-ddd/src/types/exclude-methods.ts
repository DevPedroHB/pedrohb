/**
 * Remove todas as propriedades do tipo que são métodos (funções).
 * Retorna um novo tipo contendo apenas os campos que **não** são funções.
 * @template T - Tipo original do qual os métodos devem ser excluídos.
 */
export type ExcludeMethods<T> = {
	[K in keyof T as T[K] extends Function ? never : K]: T[K];
};
