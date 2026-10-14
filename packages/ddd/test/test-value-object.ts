import { ValueObject } from "#/index.js";

export type TestValueObjectProps = {
	string: string;
	number: number;
	boolean: boolean;
	date: Date;
	bigint: bigint;
	array: string[];
	object: object;
	symbol: symbol;
	undefined: undefined;
	null: null;
};

export class TestValueObject extends ValueObject<TestValueObjectProps> {
	public toJSON() {
		return {
			...this.props,
		};
	}

	public static create(props: TestValueObjectProps) {
		return new TestValueObject(props);
	}
}
