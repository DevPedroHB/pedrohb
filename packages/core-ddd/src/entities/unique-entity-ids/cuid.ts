import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { createId, isCuid } from "@paralleldrive/cuid2";
import { UniqueEntityId } from "../unique-entity-id";

/**
 * Representa um identificador único baseado em CUID (Collision-resistant Unique Identifier),
 * estendendo a classe `UniqueEntityId`.
 */
export class CUID extends UniqueEntityId {
	/**
	 * Verifica se um valor é um CUID válido.
	 * @param cuid Valor a ser validado.
	 * @returns `true` se o valor for um CUID válido, `false` caso contrário.
	 */
	public static isValid(cuid: string): boolean {
		return isCuid(cuid);
	}

	/**
	 * Gera um novo CUID válido.
	 * @returns Uma string contendo o novo CUID gerado.
	 */
	public static generate(): string {
		return createId();
	}

	/**
	 * Cria uma nova instância da classe `CUID`.
	 * Valida o valor fornecido, ou gera um novo se nenhum for passado.
	 * @param cuid (Opcional) CUID a ser usado na criação. Se não fornecido, será gerado automaticamente.
	 * @throws {InvalidCredentialsError} Se o valor fornecido não for um CUID válido.
	 * @returns Instância de `CUID` válida.
	 */
	public static create(cuid = CUID.generate()): CUID {
		if (!CUID.isValid(cuid)) {
			throw new InvalidCredentialsError("CUID fornecido é inválido.");
		}

		return new CUID(cuid);
	}
}
