export abstract class Encrypter<Payload = unknown> {
	public abstract encrypt(payload: Payload): Promise<string>;
	public abstract decrypt(payload: string): Promise<Payload>;
}
