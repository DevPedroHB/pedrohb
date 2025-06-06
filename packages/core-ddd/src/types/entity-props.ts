import type { Entity } from "@/entities/entity";

/**
 * Extrai as propriedades (`props`) de uma instância de `Entity`.
 * @template E - O tipo da entidade.
 * @returns As propriedades internas da entidade (`P`), caso `E` estenda `Entity<P>`.
 */
export type EntityProps<E extends Entity<any>> = E extends Entity<infer P>
	? P
	: never;
