/** biome-ignore-all lint/complexity/useLiteralKeys: off */

import { makeTestValueObject } from "#test/factories/make-test-value-object.js";
import {
	TestValueObject,
	type TestValueObjectProps,
} from "#test/test-value-object.js";
import { ValueObject } from "./value-object.js";

describe("ValueObject", () => {
	class OtherValueObject extends TestValueObject {
		public static override create(props: TestValueObjectProps) {
			return new OtherValueObject(props);
		}
	}

	it("should create a value object with props", () => {
		const { props, valueObject } = makeTestValueObject();

		expect(valueObject).toBeInstanceOf(ValueObject);
		expect(valueObject.toJSON()).toEqual(props);
	});

	it("should freeze the props", () => {
		const { valueObject } = makeTestValueObject();

		expect(Object.isFrozen(valueObject["props"])).toBe(true);
	});

	it("should be equal to itself", () => {
		const { valueObject } = makeTestValueObject();

		expect(valueObject.equals(valueObject)).toBe(true);
	});

	it("should be equal to another value object with the same props", () => {
		const { props, valueObject: first } = makeTestValueObject();
		const { valueObject: second } = makeTestValueObject(props);

		expect(first.equals(second)).toBe(true);
	});

	it("should not be equal to a value object with different props", () => {
		const { valueObject: first } = makeTestValueObject();
		const { valueObject: second } = makeTestValueObject();

		expect(first.equals(second)).toBe(false);
	});

	it("should not be equal to a value object of a different class", () => {
		const { props, valueObject: first } = makeTestValueObject();
		const second = OtherValueObject.create(props);

		expect(first.equals(second)).toBe(false);
	});
});
