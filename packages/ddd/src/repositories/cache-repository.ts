import type { Aggregate } from "#/entities/aggregate.js";
import type { Entity } from "#/entities/entity.js";

export abstract class CacheRepository<E extends Entity | Aggregate = Entity> {
	public abstract readonly ttl: number;

	public abstract get(key: string): Promise<E | null>;
	public abstract has(key: string): Promise<boolean>;
	public abstract set(key: string, value: E, ttl?: number): Promise<void>;
	public abstract del(key: string): Promise<void>;
}
