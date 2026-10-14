import { Entity } from "#/index.js";
import { TestEntityId } from "./test-entity-id.js";

export type TestEntityProps = {
	name: string;
	age: number;
};

export class TestEntity extends Entity<TestEntityId, TestEntityProps> {
	public get name() {
		return this.props.name;
	}

	public set name(name) {
		this.props.name = name;
	}

	public get age() {
		return this.props.age;
	}

	public set age(age) {
		this.props.age = age;
	}

	public toJSON() {
		return {
			...this.id.toJSON(),
			...this.props,
		};
	}

	public static create(props: TestEntityProps, id = TestEntityId.create()) {
		return new TestEntity(id, props);
	}
}
