import type { Entity } from "@/entities/entity";
import type { Pagination } from "@/types/pagination";
import type { EntityFields } from "./entity-fields";
import type { FindByFields } from "./find-by-fields";
import type { SortOrder } from "./sort-order";

/**
 * Define as opções disponíveis para busca de múltiplas entidades em um repositório.
 * @template E - Tipo da entidade que estende `Entity`.
 * @property {FindByFields<E>} [fields] - Filtros baseados em campos da entidade.
 * @property {SortOrder<EntityFields<E>>} [orderBy] - Critérios de ordenação.
 * @property {Pagination} [pagination] - Opções de paginação.
 */
export type FetchAllOptions<E extends Entity<any>> = Partial<{
	fields: FindByFields<E>;
	orderBy: SortOrder<EntityFields<E>>;
	pagination: Pagination;
}>;
