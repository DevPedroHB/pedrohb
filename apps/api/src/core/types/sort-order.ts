export type TSortOrder<T> = {
	[key in keyof T]: "asc" | "desc";
};
