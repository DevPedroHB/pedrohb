import { ValueObject } from "@/core/entities/value-object";
import { ITestEntity } from "./test-entity";

export class TestValueObject extends ValueObject<ITestEntity> {
	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email;
	}

	get age() {
		return this.props.age;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(props: ITestEntity) {
		return new TestValueObject(props);
	}
}
