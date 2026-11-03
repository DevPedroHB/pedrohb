import type { Aggregate } from "#/entities/aggregate.js";
import type { Entity } from "#/entities/entity.js";
import { DDDError } from "#/errors/ddd-error.js";
import type { CacheRepository } from "./cache-repository.js";

export type InMemoryCacheEntry<E extends Entity | Aggregate = Entity> = {
	value: E;
	expiresAt: number;
};

export class InMemoryCacheRepository<E extends Entity | Aggregate = Entity>
	implements CacheRepository<E>
{
	public readonly items = new Map<string, InMemoryCacheEntry<E>>();
	public readonly ttl: number = 60 * 15; // 15 minutes

	public async get(key: string): Promise<E | null> {
		this.purgeExpired();

		const entry = this.items.get(key);

		if (!entry) {
			return null;
		}

		return entry.value;
	}

	public async has(key: string): Promise<boolean> {
		return (await this.get(key)) !== null;
	}

	public async set(key: string, value: E, ttl?: number): Promise<void> {
		this.purgeExpired();

		const seconds = this.resolveTtl(ttl);

		this.items.set(key, {
			value,
			expiresAt: Date.now() + seconds * 1000,
		});
	}

	public async del(key: string): Promise<void> {
		this.purgeExpired();

		this.items.delete(key);
	}

	public isExpired(entry: InMemoryCacheEntry<E>) {
		return Date.now() >= entry.expiresAt;
	}

	public purgeExpired() {
		let removed = 0;

		for (const [key, entry] of this.items) {
			if (this.isExpired(entry)) {
				this.items.delete(key);

				removed++;
			}
		}

		return removed;
	}

	public resolveTtl(ttl?: number) {
		const seconds = ttl ?? this.ttl;

		if (!Number.isFinite(seconds) || seconds <= 0) {
			throw new DDDError("INVALID_TTL", {
				params: {
					ttl: String(seconds),
				},
				cause: seconds,
			});
		}

		return seconds;
	}
}
