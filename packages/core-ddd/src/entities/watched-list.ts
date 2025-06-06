/**
 * Representa uma lista observável que rastreia itens adicionados, removidos e o estado atual.
 * Útil para aplicar mudanças diferenciais em coleções com base em comparações personalizadas.
 * @template T Tipo dos itens na lista.
 */
export abstract class WatchedList<T> {
	/** Estado inicial da lista. */
	public readonly initial: T[];
	/** Estado atual da lista. */
	public current: T[];
	/** Itens adicionados desde o estado inicial. */
	public added: T[];
	/** Itens removidos desde o estado inicial. */
	public removed: T[];

	/**
	 * Cria uma nova lista observável.
	 * @param initial Lista inicial de itens (padrão: lista vazia).
	 */
	constructor(initial: T[] = []) {
		this.initial = [...initial];
		this.current = [...initial];
		this.added = [];
		this.removed = [];
	}

	/**
	 * Compara dois itens da lista para verificar se são equivalentes.
	 * Deve ser implementado pela subclasse.
	 *
	 * @param a Primeiro item.
	 * @param b Segundo item.
	 * @returns `true` se forem equivalentes, `false` caso contrário.
	 */
	protected abstract compare(a: T, b: T): boolean;

	/**
	 * Remove o item fornecido da lista, com base no critério de comparação.
	 * @param list Lista original.
	 * @param item Item a ser removido.
	 * @returns Nova lista sem o item especificado.
	 */
	private filterOut(list: T[], item: T): T[] {
		return list.filter((i) => !this.compare(i, item));
	}

	/**
	 * Verifica se um item está presente na lista, com base na comparação.
	 * @param list Lista na qual procurar.
	 * @param item Item a ser verificado.
	 * @returns `true` se o item estiver presente, `false` caso contrário.
	 */
	private inList(list: T[], item: T): boolean {
		return list.some((i) => this.compare(i, item));
	}

	/**
	 * Verifica se o item está presente na lista atual.
	 * @param item Item a ser verificado.
	 * @returns `true` se o item existir na lista atual, `false` caso contrário.
	 */
	public exists(item: T): boolean {
		return this.inList(this.current, item);
	}

	/**
	 * Adiciona um item à lista atual, atualizando os estados de `added` e `removed` se necessário.
	 * @param item Item a ser adicionado.
	 */
	public add(item: T): void {
		if (this.exists(item)) return;

		if (this.inList(this.removed, item)) {
			this.removed = this.filterOut(this.removed, item);
		}

		this.current.push(item);

		if (!this.inList(this.initial, item) && !this.inList(this.added, item)) {
			this.added.push(item);
		}
	}

	/**
	 * Remove um item da lista atual, atualizando os estados de `removed` e `added` se necessário.
	 * @param item Item a ser removido.
	 */
	public remove(item: T): void {
		if (!this.exists(item)) return;

		this.current = this.filterOut(this.current, item);

		if (this.inList(this.initial, item) && !this.inList(this.removed, item)) {
			this.removed.push(item);
		}

		this.added = this.filterOut(this.added, item);
	}

	/**
	 * Atualiza a lista atual para refletir uma nova lista de itens,
	 * realizando adições e remoções conforme necessário.
	 * @param newList Lista com o novo estado desejado.
	 */
	public update(newList: T[]): void {
		for (const item of this.current) {
			if (!newList.some((n) => this.compare(n, item))) {
				this.remove(item);
			}
		}

		for (const item of newList) {
			if (!this.exists(item)) {
				this.add(item);
			}
		}
	}
}
