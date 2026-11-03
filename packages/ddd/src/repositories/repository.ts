import type { Aggregate } from "#/entities/aggregate.js";
import type { Entity } from "#/entities/entity.js";
import type { OrderBy } from "#/types/order-by.js";

export type FindAllOptions<E> = {
	page?: number;
	perPage?: number;
	orderBy?: OrderBy<E>;
};

export type Page<T> = {
	items: T[];
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
};

export abstract class Repository<E extends Entity | Aggregate = Entity> {
	public abstract findAll(options?: FindAllOptions<E>): Promise<Page<E>>;
	public abstract findById(key: E["id"]): Promise<E | null>;
	public abstract create(entity: E): Promise<void>;
	public abstract update(entity: E): Promise<void>;
	public abstract delete(entity: E): Promise<void>;
}
