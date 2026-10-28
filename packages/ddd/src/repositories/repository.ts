export abstract class Repository<
	Value extends object = object,
	Key extends keyof Value & PropertyKey = keyof Value & PropertyKey,
> {
	public abstract readonly key: Key;

	public abstract findAll(): Promise<Value[]>;
	public abstract findByKey(key: Value[Key]): Promise<Value | null>;
	public abstract create(value: Value): Promise<void>;
	public abstract update(value: Value): Promise<void>;
	public abstract delete(value: Value): Promise<void>;
}
