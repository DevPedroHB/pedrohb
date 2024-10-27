type CacheKeyValue = Record<string, any>;

/**
 * Generates a cache key by combining a prefix with key-value pairs.
 *
 * @param prefix - The prefix for the cache key.
 * @param values - An array of objects containing key-value pairs to be appended to the prefix.
 *                 If a key's value is undefined or null, it will be ignored.
 * @returns A string representing the generated cache key.
 */
export function generateCacheKey(
	prefix: string,
	values: Array<CacheKeyValue | undefined> = [],
): string {
	const keyParts = [prefix];

	for (const value of values) {
		if (value) {
			for (const [key, val] of Object.entries(value)) {
				if (val !== undefined && val !== null) {
					keyParts.push(`${key}:${val}`);
				}
			}
		}
	}

	return keyParts.join(":");
}
