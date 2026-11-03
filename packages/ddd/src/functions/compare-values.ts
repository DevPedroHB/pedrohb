const collator = new Intl.Collator("pt-BR", { numeric: true });

export function compareValues(a: unknown, b: unknown) {
	if (typeof a === "string" && typeof b === "string") {
		return collator.compare(a, b);
	}

	if (
		(typeof a === "number" || typeof a === "bigint") &&
		(typeof b === "number" || typeof b === "bigint")
	) {
		return a < b ? -1 : a > b ? 1 : 0;
	}

	if (typeof a === "boolean" && typeof b === "boolean") {
		return Number(a) - Number(b);
	}

	return collator.compare(String(a), String(b));
}
