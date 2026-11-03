export abstract class Hasher<Plain = unknown> {
	public abstract hash(plain: Plain): Promise<string>;
	public abstract verify(digest: string, plain: Plain): Promise<boolean>;
}
