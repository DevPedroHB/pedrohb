export type TPartialExcept<T, K extends keyof T> = Partial<Omit<T, K>>;
