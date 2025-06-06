import { type SlugOptions, slugify } from "@/functions/slugify";
import { ValueObject } from "../value-object";

/**
 * Representa um objeto de valor para um slug (identificador legível por URL).
 * Um slug é uma versão "amigável para URLs" de uma string, usada normalmente
 * para títulos de páginas, nomes de produtos, etc.
 */
export class Slug extends ValueObject {
	/**
	 * Slug gerado e armazenado.
	 */
	public readonly slug: string;

	private constructor(slug: string) {
		super();

		this.slug = slug;
	}

	/**
	 * Retorna o slug como string.
	 * @returns Slug como valor primitivo.
	 */
	public toValue(): string {
		return this.slug;
	}

	/**
	 * Converte uma string em um slug de forma segura para URLs.
	 * @param input Texto a ser transformado em slug.
	 * @param options Opções opcionais de personalização do slug.
	 * @returns Slug gerado.
	 */
	public static slugify(input: string, options: SlugOptions = {}): string {
		return slugify(input, options);
	}

	/**
	 * Cria uma nova instância de `Slug` a partir de um texto de entrada.
	 * @param input Texto a ser transformado em slug.
	 * @param options Opções opcionais de personalização do slug.
	 * @returns Instância de `Slug` contendo o slug gerado.
	 */
	public static create(input: string, options: SlugOptions = {}): Slug {
		const slug = Slug.slugify(input, options);

		return new Slug(slug);
	}
}
