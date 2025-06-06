/**
 * Representa um repositório de cache genérico em memória.
 * Permite armazenar, recuperar e remover valores com controle de expiração (TTL).
 * @typeParam T - Tipo do valor armazenado no cache.
 */
export abstract class CacheRepository<T> {
	/**
	 * Mapa interno com os itens em cache e suas respectivas datas de expiração.
	 */
	public items: Map<string, { value: T; expiresAt: number }> = new Map();
	/**
	 * Tempo padrão de expiração (em segundos) para novos itens.
	 */
	public expiresAt: number;

	/**
	 * Cria uma instância de CacheRepository com TTL padrão.
	 * @param expiresAt - Tempo padrão de expiração em segundos (default: 900 segundos / 15 minutos).
	 */
	constructor(expiresAt = 15 * 60) {
		this.expiresAt = expiresAt;
	}

	/**
	 * Recupera um valor do cache.
	 * Se a chave não existir ou o item estiver expirado, retorna `null`.
	 * @param key - A chave do item a ser recuperado.
	 * @returns O valor armazenado ou `null` se não encontrado ou expirado.
	 */
	public async get(key: string): Promise<T | null> {
		const entry = this.items.get(key);

		if (!entry) {
			return null;
		}

		if (Date.now() > entry.expiresAt) {
			this.items.delete(key);

			return null;
		}

		return entry.value;
	}

	/**
	 * Armazena um valor no cache com tempo de expiração opcional.
	 * @param key - A chave para armazenar o valor.
	 * @param value - O valor a ser armazenado.
	 * @param ttlSeconds - Tempo de expiração em segundos. Se não informado, será usado o valor padrão.
	 */
	public async set(key: string, value: T, ttlSeconds?: number): Promise<void> {
		const effectiveTTL = ttlSeconds ?? this.expiresAt;
		const expiresAt = Date.now() + effectiveTTL * 1000;

		this.items.set(key, { value, expiresAt });
	}

	/**
	 * Remove um item do cache.
	 * @param key - A chave do item a ser removido.
	 */
	public async del(key: string): Promise<void> {
		this.items.delete(key);
	}

	/**
	 * Retorna uma representação textual da instância para debugging ou logs.
	 * @returns Uma string de identificação baseada na classe.
	 */
	public toHash() {
		return `[${CacheRepository.name}@${this.constructor.name}]`;
	}
}
