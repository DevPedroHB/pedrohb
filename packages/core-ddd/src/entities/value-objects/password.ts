import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { compare as bcryptCompare, hash as bcryptHash, genSalt } from "bcrypt";
import { z } from "zod";
import { ValueObject } from "../value-object";

export const passwordSchema = z
	.string()
	.min(6)
	.max(32)
	.regex(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!"@#$%^&*?]).{6,32}$/);

const ALL_CHARS = {
	lower: "abcdefghijklmnopqrstuvwxyz",
	upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	digits: "0123456789",
	specials: '!"@#$%^&*?',
};

/**
 * Representa um objeto de valor para senhas, incluindo funcionalidades
 * de geração, validação, hash e comparação com hash.
 */
export class Password extends ValueObject {
	/**
	 * Senha já criptografada.
	 */
	public readonly hashed: string;

	private constructor(password: string) {
		super();

		this.hashed = password;
	}

	/**
	 * Retorna o hash da senha.
	 * @returns Hash da senha.
	 */
	public toValue(): string {
		return this.hashed;
	}

	/**
	 * Compara uma senha fornecida com o hash armazenado.
	 * @param password Senha em texto plano.
	 * @returns `true` se corresponder ao hash armazenado, caso contrário `false`.
	 */
	public async compare(password: string): Promise<boolean> {
		return await Password.compare(password, this.hashed);
	}

	/**
	 * Gera um hash da senha usando bcrypt.
	 * @param data Senha ou buffer a ser criptografado.
	 * @param saltOrRounds Número de rounds ou string de salt. Padrão é 10.
	 * @returns Hash da senha.
	 */
	public static async hash(data: string | Buffer, salt = 10): Promise<string> {
		const saltOrRounds = await genSalt(salt);

		return await bcryptHash(data, saltOrRounds);
	}

	/**
	 * Compara uma senha com um hash.
	 * @param data Senha ou buffer em texto plano.
	 * @param encrypted Hash para comparação.
	 * @returns `true` se corresponder, caso contrário `false`.
	 */
	public static async compare(
		data: string | Buffer,
		encrypted: string,
	): Promise<boolean> {
		return await bcryptCompare(data, encrypted);
	}

	/**
	 * Verifica se a senha atende aos critérios mínimos de segurança:
	 * - Entre 6 e 32 caracteres
	 * - Pelo menos uma letra maiúscula
	 * - Pelo menos uma letra minúscula
	 * - Pelo menos um dígito
	 * - Pelo menos um caractere especial
	 * @param password Senha em texto plano.
	 * @returns `true` se válida, `false` se inválida.
	 */
	public static isValid(password: string): boolean {
		return passwordSchema.safeParse(password).success;
	}

	/**
	 * Gera uma senha segura e aleatória com comprimento entre 6 e 32 caracteres.
	 * @param length Comprimento da senha. Caso omitido, é gerado aleatoriamente entre 6 e 32.
	 * @throws {InvalidCredentialsError} Se o comprimento estiver fora dos limites.
	 * @returns Senha válida gerada.
	 */
	public static generate(
		length = Math.floor(Math.random() * (32 - 6 + 1)) + 6,
	): string {
		if (length < 6 || length > 32) {
			throw new InvalidCredentialsError(
				"Comprimento inválido: deve estar entre 6 e 32.",
			);
		}

		const allChars = Object.values(ALL_CHARS).join("");

		let password: string;

		do {
			password = Array.from({ length }, () =>
				allChars.charAt(Math.floor(Math.random() * allChars.length)),
			).join("");
		} while (!Password.isValid(password));

		return password;
	}

	/**
	 * Cria uma instância de `Password` a partir de uma senha em texto plano.
	 * Se nenhuma senha for fornecida, uma nova será gerada.
	 * @param password Senha em texto plano (opcional).
	 * @param saltOrRounds Rounds ou salt para o hash. Padrão é 10.
	 * @throws {InvalidCredentialsError} Se a senha fornecida for inválida.
	 * @returns Instância de `Password` com hash seguro.
	 */
	public static async create(
		password = Password.generate(),
		salt = 10,
	): Promise<Password> {
		if (!Password.isValid(password)) {
			throw new InvalidCredentialsError(
				"Senha inválida: deve ter entre 6 e 32 caracteres, com pelo menos uma letra maiúscula, uma minúscula, um dígito e um caractere especial.",
			);
		}

		const hashed = await Password.hash(password, salt);

		return new Password(hashed);
	}
}
