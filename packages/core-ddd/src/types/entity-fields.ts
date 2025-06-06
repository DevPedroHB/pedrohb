import type { Entity } from "@/entities/entity";
import type { EntityProps } from "./entity-props";
import type { ExcludeMethods } from "./exclude-methods";

/**
 * Combina todas as propriedades de um `Entity` com seus dados (`EntityProps`),
 * excluindo quaisquer métodos herdados da entidade.
 * Útil para obter um tipo que representa os dados "puros" de uma entidade,
 * incluindo `id`, `createdAt`, etc., mas sem métodos.
 * @template E - Tipo da entidade estendida de `Entity`.
 */
export type EntityFields<E extends Entity<any>> = ExcludeMethods<E> &
	EntityProps<E>;
