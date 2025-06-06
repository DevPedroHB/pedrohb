type Primitive = string | number | boolean | null | undefined;

/**
 * Compara dois valores profundamente para verificar se são equivalentes.
 * @param a - Primeiro valor a ser comparado.
 * @param b - Segundo valor a ser comparado.
 * @returns `true` se os valores forem profundamente iguais, `false` caso contrário.
 */
function deepEqual(a: any, b: any): boolean {
	if (a === b) return true;

	// biome-ignore lint/suspicious/noDoubleEquals: Necessário para comparar null e undefined
	if (a == null || b == null) return a == b;

	if (typeof a !== "object" || typeof b !== "object") return false;

	if (Array.isArray(a) !== Array.isArray(b)) return false;

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) return false;

	for (const key of keysA) {
		if (!keysB.includes(key)) return false;

		if (!deepEqual(a[key], b[key])) return false;
	}

	return true;
}

/**
 * Filtra uma lista de itens com base nos campos fornecidos, usando comparação profunda
 * para objetos e comparação direta para tipos primitivos.
 * @template E - O tipo dos itens no array.
 * @param items - A lista de itens a ser filtrada.
 * @param fields - Os campos e valores que devem ser utilizados como critério de filtragem.
 * @returns Um novo array contendo apenas os itens que correspondem a todos os critérios.
 */
export function filterItemsByFields<E>(
	items: E[],
	fields: Partial<Record<keyof E, Primitive | object>>,
): E[] {
	const filters = Object.entries(fields) as [keyof E, any][];

	if (!filters.length) return items;

	return items.filter((item) => {
		return filters.every(([key, value]) => {
			const itemValue = item[key];

			if (value == null) return itemValue == null;

			if (typeof value === "object" && typeof itemValue === "object") {
				return deepEqual(itemValue, value);
			}

			return itemValue === value;
		});
	});
}
