import type { TPartialExcept } from "./partial-except";

export type TLogicalFilter<T, K extends keyof T = never> = {
	AND?: TLogicalFilter<T, K> | TLogicalFilter<T, K>[];
	OR?: TLogicalFilter<T, K>[];
	NOT?: TLogicalFilter<T, K> | TLogicalFilter<T, K>[];
} & TPartialExcept<T, K> & { id?: string };
