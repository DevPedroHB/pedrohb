import type { TPartialSubset } from "./partial-subset";

export type TOptional<T, K extends keyof T> = TPartialSubset<T, K> & Omit<T, K>;
