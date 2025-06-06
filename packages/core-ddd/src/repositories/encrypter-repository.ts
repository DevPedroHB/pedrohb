import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { deflateSync, inflateSync } from "node:zlib";

/**
 * Representa um repositório de criptografia genérico para compressão e codificação de payloads.
 * @typeParam T - Tipo do payload a ser encriptado ou decriptado.
 */
export abstract class EncrypterRepository<T> {
	/**
	 * Encripta um objeto para uma string segura.
	 * @param payload - O objeto a ser encriptado.
	 * @returns Uma string codificada representando o payload seguro.
	 */
	public async encrypt(payload: T): Promise<string> {
		try {
			const json = JSON.stringify(payload);
			const compressed = deflateSync(Buffer.from(json, "utf8"));

			return compressed.toString("base64url");
		} catch (error) {
			throw new InvalidCredentialsError(
				`Falha ao encriptar payload: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * Decripta uma string codificada de volta ao objeto original.
	 * @param token - A string previamente encriptada.
	 * @returns O objeto original do tipo `T`.
	 */
	public async decrypt(token: string): Promise<T> {
		try {
			const compressed = Buffer.from(token, "base64url");
			const decompressed = inflateSync(compressed).toString("utf8");

			return JSON.parse(decompressed);
		} catch (error) {
			throw new InvalidCredentialsError(
				`Falha ao decriptar payload: ${(error as Error).message}`,
			);
		}
	}

	/**
	 * Retorna uma representação textual da instância para fins de debug.
	 * @returns Uma string no formato `[EncrypterRepository@NomeDaClasse]`.
	 */
	public toHash() {
		return `[${EncrypterRepository.name}@${this.constructor.name}]`;
	}
}
