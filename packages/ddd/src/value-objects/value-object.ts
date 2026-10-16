import { valuesAreEqual } from "#/functions/values-are-equal.js";

export abstract class ValueObject<Props extends object = object> {
	protected readonly props: Props;

	public constructor(props: Props) {
		this.props = Object.freeze({ ...props });
	}

	public equals(valueObject: ValueObject<Props>): boolean {
		if (this === valueObject) {
			return true;
		}

		if (this.constructor !== valueObject.constructor) {
			return false;
		}

		return valuesAreEqual(this.props, valueObject.props);
	}

	public abstract toJSON(): object;
}
