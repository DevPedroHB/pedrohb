import { HasherRepository } from "@/domain/account/application/cryptography/hasher-repository";

export class InMemoryHasherRepository implements HasherRepository {
	public readonly hashString = "-hashed";

	async hash(plain: string) {
		return plain.concat(this.hashString);
	}

	async compare(plain: string, hash: string) {
		const hashedPlain = await this.hash(plain);

		return hashedPlain === hash;
	}
}
