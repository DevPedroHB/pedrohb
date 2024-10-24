import { EncrypterRepository } from "@/domain/account/application/cryptography/encrypter-repository";

export class InMemoryEncrypterRepository implements EncrypterRepository {
	async encrypt(payload: Record<string, unknown>) {
		return JSON.stringify(payload);
	}
}
