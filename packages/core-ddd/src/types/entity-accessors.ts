import type { Entity } from "@/entities/entity";
import type { EntityProps } from "./entity-props";

/**
 * Combina a instância de uma entidade com suas propriedades internas.
 * Útil para acessar diretamente os campos da entidade sem perder os métodos da instância.
 * @template E - O tipo da entidade.
 * @returns Um tipo que contém tanto a entidade original quanto suas propriedades.
 */
export type EntityAccessors<E extends Entity<any>> = E & EntityProps<E>;
