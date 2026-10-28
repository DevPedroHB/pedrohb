import type { Flatten } from "./flatten.js";

export type Replace<T, K extends keyof T, V> = Flatten<
	Omit<T, K> & { [P in K]: V }
>;
