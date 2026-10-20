import { faker } from "@faker-js/faker";
import {
	TestValueObject,
	type TestValueObjectProps,
} from "#test/test-value-object.js";

export function makeTestValueObject(
	overrides: Partial<TestValueObjectProps> = {},
) {
	const props: TestValueObjectProps = {
		string: faker.lorem.word(),
		number: faker.number.int({ min: 1, max: 100 }),
		boolean: faker.datatype.boolean(),
		date: faker.date.recent(),
		bigint: BigInt(faker.number.int({ min: 1, max: 100 })),
		array: Array.from({ length: 10 }, () => faker.lorem.word()),
		object: Object.fromEntries(
			Array.from({ length: 10 }, () => [
				faker.lorem.word(),
				faker.lorem.word(),
			]),
		),
		symbol: Symbol(faker.lorem.word()),
		undefined: undefined,
		null: null,
		...overrides,
	};

	return {
		props,
		valueObject: TestValueObject.create(props),
	};
}

export type MakeTestValueObject = ReturnType<typeof makeTestValueObject>;
