export type TPartialSubset<T, K extends keyof T> = Partial<Pick<T, K>>;
