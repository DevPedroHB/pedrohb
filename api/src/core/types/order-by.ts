import type { TEntityFields } from "./entity-fields";

export type TOrderBy<T> = {
	[key in keyof TEntityFields<T>]: "asc" | "desc";
};
