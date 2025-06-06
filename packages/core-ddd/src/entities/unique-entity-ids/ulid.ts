import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import {
  type PRNG,
  decodeTime,
  encodeTime,
  fixULIDBase32,
  incrementBase32,
  isValid,
  ulid,
  ulidToUUID,
  uuidToULID,
} from "ulid";
import { UniqueEntityId } from "../unique-entity-id";

/**
 * Representa um identificador único baseado em ULID (Universally Unique Lexicographically Sortable Identifier),
 * estendendo a classe `UniqueEntityId`. Fornece utilitários para validação, conversão e manipulação de ULIDs.
 */
export class ULID extends UniqueEntityId {
	/**
	 * Decodifica o carimbo de tempo de um ULID.
	 * @param ulid ULID a ser decodificado.
	 * @returns Timestamp em milissegundos.
	 */
	public static decodeTime(ulid: string): number {
		return decodeTime(ulid);
	}

	/**
	 * Codifica um carimbo de tempo para o formato de tempo do ULID.
	 * @param now Timestamp em milissegundos.
	 * @param len Comprimento da string codificada (opcional).
	 * @returns Representação codificada do tempo em Base32.
	 */
	public static encodeTime(now: number, len?: number): string {
		return encodeTime(now, len);
	}

	/**
	 * Corrige um ULID que tenha caracteres fora do padrão Base32 do Crockford.
	 * @param ulid ULID a ser corrigido.
	 * @returns ULID corrigido.
	 */
	public static fixULIDBase32(ulid: string): string {
		return fixULIDBase32(ulid);
	}

	/**
	 * Incrementa uma string ULID codificada em Base32.
	 * @param str String Base32 a ser incrementada.
	 * @returns String incrementada.
	 */
	public static incrementBase32(str: string): string {
		return incrementBase32(str);
	}

	/**
	 * Converte um ULID para o formato UUID.
	 * @param ulid ULID válido.
	 * @returns Representação UUID do ULID.
	 */
	public static ulidToUUID(ulid: string): string {
		return ulidToUUID(ulid);
	}

	/**
	 * Converte um UUID para o formato ULID.
	 * @param uuid UUID válido.
	 * @returns Representação ULID do UUID.
	 */
	public static uuidToULID(uuid: string): string {
		return uuidToULID(uuid);
	}

	/**
	 * Verifica se um valor fornecido é um ULID válido.
	 * @param ulid String ULID.
	 * @returns `true` se o ULID for válido, `false` caso contrário.
	 */
	public static isValid(ulid: string): boolean {
		return isValid(ulid);
	}

	/**
	 * Gera um novo ULID.
	 * @param seedTime Carimbo de tempo em milissegundos (opcional).
	 * @param prng Função geradora de números pseudoaleatórios (opcional).
	 * @returns Novo ULID gerado.
	 */
	public static generate(seedTime?: number, prng?: PRNG): string {
		return ulid(seedTime, prng);
	}

	/**
	 * Cria uma instância de `ULID`, validando o valor fornecido.
	 * Se nenhum valor for passado, um novo ULID é gerado automaticamente.
	 * @param ulid ULID existente ou gerado automaticamente.
	 * @throws {InvalidCredentialsError} Se o ULID fornecido for inválido.
	 * @returns Instância de `ULID`.
	 */
	public static create(ulid = ULID.generate()): ULID {
		if (!ULID.isValid(ulid)) {
			throw new InvalidCredentialsError("ULID fornecido é inválido.");
		}

		return new ULID(ulid);
	}
}
