import { randomInt } from "node:crypto";
import argon2 from "argon2";
import { DDDError } from "#/errors/ddd-error.js";
import { ValueObject } from "./value-object.js";

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 128;
/**
 * Define o padrão utilizado para validar a força de uma senha.
 *
 * Por padrão, a senha deve:
 * |=> 1. Possuir no mínimo 12 caracteres.
 * |=> 2. Possuir no máximo 128 caracteres.
 * |=> 3. Não conter espaços em branco.
 * |=> 4. Conter pelo menos uma letra minúscula.
 * |=> 5. Conter pelo menos uma letra maiúscula.
 * |=> 6. Conter pelo menos um número.
 * |=> 7. Conter pelo menos um caractere especial.
 */
export const PASSWORD_STRENGTH_REGEX = new RegExp(
	`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z\\d\\s])\\S{${MIN_PASSWORD_LENGTH},${MAX_PASSWORD_LENGTH}}$`,
);
export const PASSWORD_CHARSETS = {
	lowercase: "abcdefghijklmnopqrstuvwxyz",
	uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	numbers: "0123456789",
	special: "!@#$%^&*()-_=+[]{};:,.?",
} as const;
export const PASSWORD_ALPHABET = Object.values(PASSWORD_CHARSETS).join("");
const pick = (charset: string): string =>
	charset.charAt(randomInt(charset.length));

export type PasswordProps = {
	password: string;
};

export class Password extends ValueObject<PasswordProps> {
	private constructor(props: PasswordProps) {
		super(props);
	}

	public get password() {
		return this.props.password;
	}

	public toJSON() {
		return {
			password: this.password,
		};
	}

	public static async hash(
		password: Buffer | string,
		options?: argon2.HashOptions & {
			raw?: boolean;
		},
	) {
		return await argon2.hash(password, options);
	}

	public static needsRehash(
		digest: string,
		options?: {
			timeCost?: number;
			memoryCost?: number;
			parallelism?: number;
			version?: number;
		},
	) {
		return argon2.needsRehash(digest, options);
	}

	public static async verify(
		digest: string,
		password: Buffer | string,
		options?: argon2.VerifyOptions,
	) {
		return await argon2.verify(digest, password, options);
	}

	public static generate(size = MIN_PASSWORD_LENGTH): string {
		if (
			!Number.isInteger(size) ||
			size < MIN_PASSWORD_LENGTH ||
			size > MAX_PASSWORD_LENGTH
		) {
			throw new DDDError("INVALID_PASSWORD_SIZE", {
				params: { size, min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH },
				cause: size,
			});
		}

		const chars = [
			pick(PASSWORD_CHARSETS.lowercase),
			pick(PASSWORD_CHARSETS.uppercase),
			pick(PASSWORD_CHARSETS.numbers),
			pick(PASSWORD_CHARSETS.special),
			...Array.from({ length: size - 4 }, () => pick(PASSWORD_ALPHABET)),
		];

		for (let i = chars.length - 1; i > 0; i--) {
			const j = randomInt(i + 1);

			[chars[i], chars[j]] = [chars[j], chars[i]];
		}

		return chars.join("");
	}

	public static async create(
		password: Buffer | string,
		options?: argon2.HashOptions & {
			raw?: boolean;
		},
	) {
		if (!PASSWORD_STRENGTH_REGEX.test(password.toString())) {
			throw new DDDError("INVALID_PASSWORD_STRENGTH", {
				cause: password,
			});
		}

		const passwordHash = await Password.hash(password, options);

		return new Password({
			password: passwordHash,
		});
	}

	public static createFromHash(hash: string) {
		return new Password({ password: hash });
	}
}
