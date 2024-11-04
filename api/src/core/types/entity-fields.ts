export type TEntityFields<T, K extends keyof T = never> = {
	AND?: TEntityFields<T, K> | TEntityFields<T, K>[];
	OR?: TEntityFields<T, K>[];
	NOT?: TEntityFields<T, K> | TEntityFields<T, K>[];
} & Omit<Partial<T>, K> & { id?: string };
