type CacheKeyValue = Record<string, any>;

/**
 * Gera uma chave de cache a partir de um prefixo e um array de objetos,
 * onde cada objeto tem chave/valor. A chave de cache   formatada como
 * "prefixo:chave1:valor1:chave2:valor2:...". Se algum valor for null ou
 * undefined, ele é ignorado.
 *
 * @param prefix O prefixo da chave de cache.
 * @param values Um array de objetos com chave/valor.
 * @returns A chave de cache gerada.
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
