import { MethodNotImplementedError } from "@/errors/method-not-implemented-error";
import { slugify } from "@/functions/slugify";

/**
 * Representa um objeto de valor no domínio, definido por seus atributos e não por identidade.
 * Objetos de valor são imutáveis e iguais se seus valores forem iguais.
 */
export abstract class ValueObject {
	/**
	 * Retorna o valor bruto que representa este objeto de valor.
	 * Deve ser implementado pelas subclasses.
	 * @returns Valor que representa o objeto de valor.
	 */
	public abstract toValue(): any;

	/**
	 * Compara este objeto de valor com outro.
	 * @param valueObject Outro objeto de valor para comparar.
	 * @returns `true` se forem a mesma instância ou se seus valores forem iguais; caso contrário, `false`.
	 */
	public equals(valueObject: ValueObject): boolean {
		if (this === valueObject) {
			return true;
		}

		if (!(valueObject instanceof this.constructor)) {
			return false;
		}

		return JSON.stringify(this) === JSON.stringify(valueObject);
	}

	/**
	 * Retorna uma representação com hash do objeto de valor, útil para logs ou cache.
	 * Usa `slugify` no valor retornado por `toValue`.
	 * @returns String representando o objeto de valor.
	 */
	public toHash(): string {
		const data = slugify(this.toValue());

		return `[${ValueObject.name}@${this.constructor.name}]:${data}`;
	}

	/**
	 * Método de fábrica abstrato que deve ser implementado por subclasses.
	 * Lança um erro se não for sobrescrito.
	 * @throws {MethodNotImplementedError} Sempre que chamado diretamente.
	 */
	public static create(..._args: any) {
		throw new MethodNotImplementedError("Método create não implementado.");
	}
}
