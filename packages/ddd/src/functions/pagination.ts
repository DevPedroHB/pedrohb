import { DDDError } from "#/errors/ddd-error.js";
import type { Page } from "#/repositories/repository.js";

export const DEFAULT_PEER_PAGE = 20;

export type PaginationInput = {
	page?: number;
	perPage?: number;
};

export type ResolvedPagination = {
	page: number;
	perPage: number;
	offset: number;
};

export function resolvePagination({
	page = 1,
	perPage = DEFAULT_PEER_PAGE,
}: PaginationInput = {}): ResolvedPagination {
	const valid =
		Number.isSafeInteger(page) &&
		page >= 1 &&
		Number.isSafeInteger(perPage) &&
		perPage >= 1;

	if (!valid) {
		throw new DDDError("INVALID_PAGINATION", {
			params: {
				page: String(page),
				perPage: String(perPage),
			},
			cause: { page, perPage },
		});
	}

	return { page, perPage, offset: (page - 1) * perPage };
}

export function buildPage<T>(
	items: T[],
	total: number,
	{ page, perPage }: Pick<ResolvedPagination, "page" | "perPage">,
): Page<T> {
	return {
		items,
		total,
		page,
		perPage,
		totalPages: Math.ceil(total / perPage),
	};
}
