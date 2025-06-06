import { MethodNotImplementedError } from "@/errors/method-not-implemented-error";

/**
 * Representa uma identidade única de uma entidade no domínio.
 * Deve ser estendida por classes concretas que fornecem lógica de criação.
 */
export abstract class UniqueEntityId {
	/** Identificador único da entidade. */
	public readonly id: string;

	/**
	 * Construtor protegido para garantir que apenas subclasses possam instanciar.
	 * @param id Identificador único a ser atribuído.
	 */
	protected constructor(id: string) {
		this.id = id;
	}

	/**
	 * Retorna o valor bruto do identificador.
	 * @returns O valor do identificador.
	 */
	public toValue(): string {
		return this.id;
	}

	/**
	 * Compara esta instância com outra `UniqueEntityId`.
	 * @param id Outra instância de `UniqueEntityId` para comparação.
	 * @returns `true` se os identificadores forem iguais ou as instâncias forem a mesma, `false` caso contrário.
	 */
	public equals(id: UniqueEntityId): boolean {
		return this === id || this.id === id.toValue();
	}

	/**
	 * Retorna uma representação com hash da identidade única, útil para logs ou cache.
	 * @returns String representando a identidade com base na classe e no id.
	 */
	public toHash(): string {
		return `[${UniqueEntityId.name}@${this.constructor.name}]:${this.id}`;
	}

	/**
	 * Método de fábrica abstrato que deve ser implementado por subclasses.
	 * Lança um erro se não for sobrescrito.
	 * @throws {MethodNotImplementedError} Sempre que for chamado diretamente.
	 */
	public static create(..._args: any) {
		throw new MethodNotImplementedError("Método create não implementado.");
	}
}
