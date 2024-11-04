import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export function matchesFields<
	T,
	TFields extends {
		AND?: TFields | TFields[];
		OR?: TFields[];
		NOT?: TFields | TFields[];
	},
>(item: T, fields: TFields): boolean {
	if (fields.AND) {
		const conditions = Array.isArray(fields.AND) ? fields.AND : [fields.AND];

		return conditions.every((condition) => matchesFields(item, condition));
	}

	if (fields.OR) {
		return fields.OR.some((condition) => matchesFields(item, condition));
	}

	if (fields.NOT) {
		const conditions = Array.isArray(fields.NOT) ? fields.NOT : [fields.NOT];

		return conditions.every((condition) => !matchesFields(item, condition));
	}

	return Object.entries(fields).every(([key, value]) => {
		if (key === "AND" || key === "OR" || key === "NOT") return true;

		const itemValue = (item as any)[key];

		if (itemValue instanceof UniqueEntityID) {
			return itemValue.equals(new UniqueEntityID(String(value)));
		}

		return itemValue === value;
	});
}
