import { MethodNotImplementedError } from "@/errors/method-not-implemented-error";
import type { EntityAccessors } from "@/types/entity-accessors";
import type { UniqueEntityId } from "./unique-entity-id";

/**
 * Representa uma entidade no domínio, identificada unicamente por um ID e composta por propriedades imutáveis.
 * @template T Tipo do objeto que representa as propriedades da entidade.
 */
export abstract class Entity<T extends object> {
	/** Identificador único da entidade. */
	public readonly id: UniqueEntityId;
	/** Propriedades internas da entidade. */
	protected readonly props: T;

	/**
	 * Cria uma nova instância de entidade.
	 * @param props Propriedades da entidade.
	 * @param id Identificador único da entidade.
	 */
	protected constructor(props: T, id: UniqueEntityId) {
		this.id = id;
		this.props = props;
	}

	/**
	 * Define dinamicamente propriedades públicas com getters e setters
	 * baseados em `this.props`, usando `Object.defineProperty`.
	 * @template E Entidade com tipo estendido.
	 * @returns A instância da entidade com acesso direto às propriedades.
	 */
	protected withAccessorsDefineProperty<E extends Entity<T>>(): EntityAccessors<E> {
		const propertyNames = Object.keys(this.props) as Array<keyof T>;

		for (const key of propertyNames) {
			if (!Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), key)) {
				Object.defineProperty(this, key, {
					get: () => this.props[key],
					set: (value: T[typeof key]) => {
						this.props[key] = value;
					},
					enumerable: true,
					configurable: true,
				});
			}
		}

		return this as unknown as EntityAccessors<E>;
	}

	/**
	 * Retorna um proxy da entidade que intercepta acessos e modificações às propriedades.
	 * Permite acessar `this.props` como se fossem propriedades diretas da entidade.
	 * @template E Entidade com tipo estendido.
	 * @returns Um proxy da entidade com suporte a acesso transparente às propriedades.
	 */
	protected withAccessorsProxy<E extends Entity<T>>(): EntityAccessors<E> {
		const handler: ProxyHandler<E> = {
			get: (target: E, prop: string | symbol) => {
				if (prop in target) {
					return Reflect.get(target, prop);
				}

				if (typeof prop === "string" && prop in target.props) {
					return target.props[prop as keyof T];
				}

				return undefined;
			},
			set: (target: E, prop: string | symbol, value: any) => {
				if (prop in target && prop !== "props" && prop !== "id") {
					return Reflect.set(target, prop, value);
				}

				if (typeof prop === "string" && prop in target.props) {
					target.props[prop as keyof T] = value;

					return true;
				}

				return Reflect.set(target, prop, value);
			},
			has: (target: E, prop: string | symbol) => {
				return (
					prop in target || (typeof prop === "string" && prop in target.props)
				);
			},
		};

		return new Proxy(this as unknown as E, handler) as EntityAccessors<E>;
	}

	/**
	 * Compara esta entidade com outra, com base no ID.
	 * @param entity Entidade a ser comparada.
	 * @returns `true` se forem a mesma instância ou se tiverem o mesmo ID.
	 */
	public equals(entity: Entity<T>): boolean {
		if (this === entity) {
			return true;
		}

		return this.id.equals(entity.id);
	}

	/**
	 * Retorna uma representação com hash da entidade, útil para logs ou cache.
	 * @returns String representando a entidade com base no nome da classe e ID.
	 */
	public toHash(): string {
		return `[${Entity.name}@${this.constructor.name}]:${this.id.toValue()}`;
	}

	/**
	 * Converte a entidade em um objeto simples (DTO).
	 * Este método deve ser implementado pelas subclasses.
	 * @returns Um objeto representando a entidade.
	 */
	public abstract toObject(): object;

	/**
	 * Método de fábrica abstrato para criação da entidade.
	 * Deve ser sobrescrito nas subclasses.
	 * @param props Propriedades da entidade.
	 * @param id Identificador opcional da entidade.
	 * @throws {MethodNotImplementedError} Sempre que chamado diretamente.
	 */
	public static create(_props: any, _id?: UniqueEntityId) {
		throw new MethodNotImplementedError("Método create não implementado.");
	}
}
