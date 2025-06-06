import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import {
  type UUIDTypes,
  parse,
  stringify,
  v1,
  v3,
  v4,
  v5,
  v6,
  v7,
  validate,
  version,
} from "uuid";
import { UniqueEntityId } from "../unique-entity-id";

/**
 * Representa um identificador único baseado em UUID (Universally Unique Identifier),
 * estendendo a classe `UniqueEntityId`. Suporta múltiplas versões de UUID e utilitários para validação e conversão.
 */
export class UUID extends UniqueEntityId {
	/**
	 * Versão do UUID associado a esta instância.
	 */
	public readonly version: number;

	private constructor(uuid: string) {
		super(uuid);

		this.version = UUID.version(uuid);
	}

	/**
	 * Converte uma string UUID para um array de bytes.
	 * @param uuid UUID válido.
	 * @returns `Uint8Array` representando o UUID.
	 */
	public static parse(uuid: string): Uint8Array {
		return parse(uuid);
	}

	/**
	 * Converte um array de bytes para a string UUID correspondente.
	 * @param arr Array de bytes.
	 * @param offset Offset de leitura (opcional).
	 * @returns UUID no formato string.
	 */
	public static stringify(arr: Uint8Array, offset?: number): string {
		return stringify(arr, offset);
	}

	/**
	 * Obtém a versão de um UUID.
	 * @param uuid UUID válido.
	 * @returns Número da versão (1, 3, 4, 5, 6 ou 7).
	 */
	public static version(uuid: string): number {
		return version(uuid);
	}

	/**
	 * Verifica se um valor fornecido é um UUID válido.
	 * @param uuid Valor a ser verificado.
	 * @returns `true` se for válido, `false` caso contrário.
	 */
	public static isValid(uuid: unknown): boolean {
		return validate(uuid);
	}

	/**
	 * Gera um novo UUID com a versão especificada.
	 * @param version Versão do UUID (padrão é "v4").
	 * @param value Valor de entrada usado nas versões v3 e v5 (opcional).
	 * @param namespace Namespace usado nas versões v3 e v5 (opcional).
	 * @throws {InvalidCredentialsError} Se os parâmetros forem inválidos para a versão escolhida.
	 * @returns UUID gerado como string.
	 */
	public static generate(
		version: "v1" | "v3" | "v4" | "v5" | "v6" | "v7" = "v4",
		value?: string | Uint8Array,
		namespace?: UUIDTypes,
	): string {
		try {
			switch (version) {
				case "v1":
					return v1();
				case "v3":
					if (!value || !namespace) {
						throw new InvalidCredentialsError(
							"É necessário fornecer 'value' e 'namespace' para gerar UUID v3.",
						);
					}

					return v3(value, namespace);
				case "v4":
					return v4();
				case "v5":
					if (!value || !namespace) {
						throw new InvalidCredentialsError(
							"É necessário fornecer 'value' e 'namespace' para gerar UUID v5.",
						);
					}

					return v5(value, namespace);
				case "v6":
					return v6();
				case "v7":
					return v7();
				default:
					throw new InvalidCredentialsError("Versão de UUID inválida.");
			}
		} catch (error) {
			if (error instanceof TypeError) {
				throw new InvalidCredentialsError(
					"Parâmetros inválidos fornecidos para geração de UUID.",
				);
			}

			throw error;
		}
	}

	/**
	 * Cria uma instância da classe `UUID`, validando o valor fornecido.
	 * Se nenhum valor for passado, um novo UUID v4 será gerado automaticamente.
	 * @param uuid UUID existente ou gerado automaticamente.
	 * @throws {InvalidCredentialsError} Se o UUID fornecido for inválido.
	 * @returns Instância válida de `UUID`.
	 */
	public static create(uuid = UUID.generate()): UUID {
		if (!UUID.isValid(uuid)) {
			throw new InvalidCredentialsError("UUID fornecido é inválido.");
		}

		return new UUID(uuid);
	}
}
