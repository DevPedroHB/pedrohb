/**
 * Representa um repositório genérico para operações de hash.
 */
export abstract class HasherRepository {
	/**
	 * Gera um hash hexadecimal a partir de uma string simples.
	 * @param plain - A string a ser convertida em hash.
	 * @returns Um hash hexadecimal.
	 */
	public async hash(plain: string): Promise<string> {
		let hash = 0x811c9dc5;

		for (let i = 0; i < plain.length; i++) {
			hash ^= plain.charCodeAt(i);
			hash = (hash * 0x01000193) >>> 0;
		}

		return hash.toString(16).padStart(8, "0"); // FNV-1a 32-bit
	}

	/**
	 * Compara uma string com um hash previamente gerado.
	 * A string é reprocessada com o algoritmo de hash e comparada com o valor informado.
	 * @param plain - A string original.
	 * @param hashed - O hash previamente gerado.
	 * @returns `true` se os valores forem equivalentes, `false` caso contrário.
	 */
	public async compare(plain: string, hashed: string): Promise<boolean> {
		const computed = await this.hash(plain);

		return computed === hashed;
	}

	/**
	 * Retorna uma representação textual da instância para fins de debug.
	 * @returns Uma string no formato `[HasherRepository@NomeDaClasse]`.
	 */
	public toHash() {
		return `[${HasherRepository.name}@${this.constructor.name}]`;
	}
}
