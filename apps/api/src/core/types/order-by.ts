export type TOrderBy<T> = {
	[key in keyof T]: "asc" | "desc";
};
