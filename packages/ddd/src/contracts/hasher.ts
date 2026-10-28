export abstract class Hasher<Plain = unknown> {
	public abstract hash(plain: Plain): Promise<string>;
	public abstract compare(plain: Plain, hash: string): Promise<boolean>;
}
