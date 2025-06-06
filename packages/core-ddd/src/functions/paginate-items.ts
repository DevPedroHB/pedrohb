import type { Pagination } from "@/types/pagination";

/**
 * Realiza a paginação de uma lista de itens, retornando apenas os itens da página atual.
 * @template T - Tipo dos itens no array.
 * @param items - Lista completa de itens a serem paginados.
 * @param pagination - Objeto contendo os parâmetros de paginação.
 * @param pagination.page - Número da página atual (começando em 1). Padrão: 1.
 * @param pagination.perPage - Quantidade de itens por página. Padrão: 10.
 * @returns Um novo array contendo apenas os itens da página especificada.
 * @example
 * ```ts
 * const result = paginateItems([1, 2, 3, 4, 5], { page: 2, perPage: 2 });
 * // result: [3, 4]
 * ```
 */
export function paginateItems<T>(
	items: T[],
	{ page = 1, perPage = 10 }: Pagination,
) {
	const start = (page - 1) * perPage;
	const end = start + perPage;

	return items.slice(start, end);
}
