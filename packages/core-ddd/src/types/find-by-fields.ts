import type { Entity } from "@/entities/entity";
import type { EntityFields } from "./entity-fields";

/**
 * Tipo utilitário para busca parcial em repositórios.
 * Permite especificar um subconjunto dos campos de uma entidade (sem métodos)
 * como critérios de busca.
 * @template E - Tipo da entidade que estende `Entity`.
 */
export type FindByFields<E extends Entity<any>> = Partial<EntityFields<E>>;
