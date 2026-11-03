import type { Aggregate } from "#/entities/aggregate.js";
import type { Entity } from "#/entities/entity.js";
import { EntityId } from "#/entity-ids/entity-id.js";
import { compareValues } from "./compare-values.js";
import type { SortCriterion } from "./to-criteria.js";

function toComparable(value: unknown): unknown {
	if (value instanceof EntityId) {
		return value.id;
	}

	if (value instanceof Date) {
		return value.getTime();
	}

	return value;
}

export function sortEntities<E extends Entity | Aggregate>(
	entities: E[],
	criteria: SortCriterion<E>[],
): E[] {
	const decorated = entities.map((entity) => ({
		entity,
		values: criteria.map(({ field }) => toComparable(entity[field as keyof E])),
	}));

	decorated.sort((x, y) => {
		for (let i = 0; i < criteria.length; i++) {
			const a = x.values[i];
			const b = y.values[i];

			if (a == null || b == null) {
				if (a == null && b == null) {
					continue;
				}

				return a == null ? 1 : -1;
			}

			const result = compareValues(a, b) * criteria[i].factor;

			if (result !== 0) {
				return result;
			}
		}

		return 0;
	});

	return decorated.map(({ entity }) => entity);
}
