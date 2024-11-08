import type { IPagination } from "./pagination";
import type { TSortOrder } from "./sort-order";

export type TQueryOptions<T> = {
	pagination?: IPagination;
	orderBy?: TSortOrder<T>;
	fields?: T;
};
