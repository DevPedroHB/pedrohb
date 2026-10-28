export abstract class CacheRepository<T = unknown> {
	public abstract readonly ttl: number;

	public abstract get(key: string): Promise<T | null>;
	public abstract has(key: string): Promise<boolean>;
	public abstract set(key: string, value: T, ttl?: number): Promise<void>;
	public abstract del(key: string): Promise<void>;
}
