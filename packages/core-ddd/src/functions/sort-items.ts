import type { SortOrder } from "@/types/sort-order";

/**
 * Ordena uma lista de itens com base em critérios fornecidos.
 * @template T - Tipo dos itens do array.
 * @param items - Array de itens a serem ordenados.
 * @param orderBy - Objeto que define os campos e a ordem de ordenação
 * (`asc` para ascendente, `desc` para descendente).
 * @returns Um novo array com os itens ordenados conforme os critérios.
 * @example
 * ```ts
 * const items = [
 *   { name: "Alice", age: 30 },
 *   { name: "Bob", age: 25 },
 *   { name: "Carol", age: 35 }
 * ];
 *
 * sortItems(items, { age: "asc" });
 * // → ordena por idade crescente
 *
 * sortItems(items, { name: "desc", age: "asc" });
 * // → ordena por nome decrescente e, em caso de empate, por idade crescente
 * ```
 */
export function sortItems<T>(items: T[], orderBy: SortOrder<T>) {
	const criteria = Object.entries(orderBy) as [keyof T, "asc" | "desc"][];

	if (criteria.length === 0) {
		return items;
	}

	return [...items].sort((a, b) => {
		for (const [key, direction] of criteria) {
			const valA = a[key];
			const valB = b[key];

			if (valA == null && valB == null) continue;

			if (valA == null) return direction === "asc" ? 1 : -1;

			if (valB == null) return direction === "asc" ? -1 : 1;

			if (typeof valA === "string" && typeof valB === "string") {
				const cmp = valA.localeCompare(valB);

				if (cmp !== 0) {
					return direction === "asc" ? cmp : -cmp;
				}

				continue;
			}

			if (valA < valB) {
				return direction === "asc" ? -1 : 1;
			}

			if (valA > valB) {
				return direction === "asc" ? 1 : -1;
			}
		}

		return 0;
	});
}
