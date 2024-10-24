export abstract class EncrypterRepository {
	abstract encrypt(payload: Record<string, unknown>): Promise<string>;
}
