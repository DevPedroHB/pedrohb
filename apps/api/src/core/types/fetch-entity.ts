import type { TOrderBy } from "./order-by";
import type { IPagination } from "./pagination";

export type TFetchEntity<T> = {
	pagination?: IPagination;
	orderBy?: TOrderBy<T>;
	fields?: T;
};
