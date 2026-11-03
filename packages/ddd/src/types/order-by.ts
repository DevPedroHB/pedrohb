export type SortField<E> = Extract<keyof E, string>;

export type SortDirection = "asc" | "desc";

export type OrderBy<E> = Partial<Record<SortField<E>, SortDirection>>;
