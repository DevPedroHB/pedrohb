import { MethodNotImplementedError } from "@/errors/method-not-implemented-error";
import { ValueObject } from "./value-object";

interface IFullName {
	firstName: string;
	lastName: string;
}

class FullName extends ValueObject {
	private readonly props: IFullName;

	constructor(props: IFullName) {
		super();

		this.props = props;
	}

	public toValue() {
		return `${this.props.firstName} ${this.props.lastName}`;
	}

	public get firstName() {
		return this.props.firstName;
	}

	public get lastName() {
		return this.props.lastName;
	}
}

describe("ValueObject", () => {
	it("should be able to return a hash with the correct format", () => {
		const fullName = new FullName({ firstName: "John", lastName: "Doe" });
		const hash = fullName.toHash();

		expect(typeof hash).toBe("string");
		expect(hash.length).toBeGreaterThan(0);
	});

	it("should be able to compare equality by reference", () => {
		const fullName = new FullName({ firstName: "John", lastName: "Doe" });

		expect(fullName.equals(fullName)).toBe(true);
	});

	it("should be able to compare equality by value", () => {
		const a = new FullName({ firstName: "John", lastName: "Doe" });
		const b = new FullName({ firstName: "John", lastName: "Doe" });

		expect(a.equals(b)).toBe(true);
	});

	it("should not be able to compare with different class instances", () => {
		class OtherValueObject extends ValueObject {
			toValue() {
				return "John Doe";
			}
		}

		const a = new FullName({ firstName: "John", lastName: "Doe" });
		const b = new OtherValueObject();

		expect(a.equals(b)).toBe(false);
	});

	it("should not be able to call static create method on base class", () => {
		expect(() => ValueObject.create()).toThrow(MethodNotImplementedError);
	});
});
