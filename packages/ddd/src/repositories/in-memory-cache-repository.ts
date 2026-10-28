import { DDDError } from "#/errors/ddd-error.js";
import type { CacheRepository } from "./cache-repository.js";

export type InMemoryCacheEntry<T = unknown> = {
	value: T;
	expiresAt: number;
};

export class InMemoryCacheRepository<T = unknown>
	implements CacheRepository<T>
{
	protected readonly items = new Map<string, InMemoryCacheEntry<T>>();
	public readonly ttl: number = 60 * 15; // 15 minutes

	public async get(key: string): Promise<T | null> {
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

	public async set(key: string, value: T, ttl?: number): Promise<void> {
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

	public isExpired(entry: InMemoryCacheEntry<T>) {
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
			});
		}

		return seconds;
	}
}
