import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import crypto from "node:crypto";
import { slugify } from "./slugify";

const MAX_KEY_LENGTH = 100;

/**
 * Gera uma chave de cache formatada e consistente baseada em um prefixo e um payload.
 * A chave resultante segue o padrão: `env:prefix:key1:slug1:key2:slug2...`, limitada a 100 caracteres.
 * Valores do payload que são objetos são convertidos para um hash SHA-1 para evitar conflitos.
 * @param prefix - Prefixo da chave, usado para categorizar as entradas no cache.
 * @param payload - Objeto contendo os parâmetros que serão usados para gerar a parte variável da chave.
 * @throws {InvalidCredentialsError} Se o prefixo for vazio.
 * @returns Uma string representando a chave de cache formatada.
 * @example
 * ```ts
 * formatCacheKey("users", { name: "John Doe", age: 30 });
 * // "dev:users:name:john_doe:age:30"
 * ```
 */
export function formatCacheKey(
	prefix: string,
	payload: Record<string, any>,
): string {
	if (!prefix) {
		throw new InvalidCredentialsError("O prefixo da chave não pode ser vazio.");
	}

	const environment = process.env.NODE_ENV || "dev";
	const parts = [environment, prefix];
	const sortedKeys = Object.keys(payload).sort();

	for (const key of sortedKeys) {
		const value = payload[key];

		if (value !== null && value !== undefined) {
			const normalizedKey = slugify(key, {
				separator: "-",
			});

			let slug: string;

			if (typeof value === "object") {
				slug = crypto
					.createHash("sha1")
					.update(JSON.stringify(value))
					.digest("hex");
			} else {
				slug = slugify(String(value), {
					separator: "_",
				});
			}

			parts.push(`${normalizedKey}:${slug}`);
		}
	}

	let finalKey = parts.join(":");

	if (finalKey.length > MAX_KEY_LENGTH) {
		finalKey = finalKey.substring(0, MAX_KEY_LENGTH);
	}

	return finalKey;
}
