import argon2 from "argon2";
import type { Hasher } from "./hasher.js";

export class Argon2idHasher implements Hasher<Buffer | string> {
	public async hash(
		plain: Buffer | string,
		options?: argon2.HashOptions & {
			raw?: boolean;
		},
	): Promise<string> {
		return await argon2.hash(plain, options);
	}

	public async verify(
		digest: string,
		plain: Buffer | string,
		options?: argon2.VerifyOptions,
	): Promise<boolean> {
		return await argon2.verify(digest, plain, options);
	}
}
