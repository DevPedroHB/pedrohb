import type { OrderBy, SortDirection, SortField } from "#/types/order-by.js";

export type SortCriterion<E> = {
	field: SortField<E>;
	factor: 1 | -1;
};

export function toCriteria<E>(orderBy: OrderBy<E>): SortCriterion<E>[] {
	return (
		Object.entries(orderBy) as [SortField<E>, SortDirection | undefined][]
	)
		.filter(([, direction]) => direction !== undefined)
		.map(([field, direction]) => ({
			field,
			factor: direction === "desc" ? -1 : 1,
		}));
}
