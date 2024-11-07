import { UniqueEntityID } from "@/core/entities/unique-entity-id";

/**
 * Verifica se um objeto tem os campos especificados.
 *
 * @param item O objeto que ser  verificado.
 * @param fields Os campos que o objeto precisa ter para que a fun o retorne true.
 *   Os campos AND, OR e NOT s o especiais e s o usados para criar queries mais complexas.
 *   Se o campo AND for especificado, todos os campos especificados nele precisam ser verdadeiros.
 *   Se o campo OR for especificado, pelo menos um dos campos especificados nele precisa ser verdadeiro.
 *   Se o campo NOT for especificado, todos os campos especificados nele precisam ser falsos.
 *   Se n o for especificado nenhum dos campos AND, OR ou NOT, a fun o vai verificar se o objeto tem
 *   todos os campos especificados em fields e se eles tem o valor especificado.
 *
 * @returns true se o objeto tem todos os campos especificados, false caso contrario.
 */
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
