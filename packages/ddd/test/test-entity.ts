import { Entity, type Optional, Timestamps } from "#/index.js";
import { TestEntityId } from "./test-entity-id.js";

export type TestEntityProps = {
	name: string;
	age: number;
	timestamps: Timestamps;
};

export class TestEntity extends Entity<TestEntityId, TestEntityProps> {
	protected constructor(id: TestEntityId, props: TestEntityProps) {
		super(id, props);
	}

	public get name() {
		return this.props.name;
	}

	public set name(name) {
		this.props.name = name;

		this.props.timestamps.touch();
	}

	public get age() {
		return this.props.age;
	}

	public set age(age) {
		this.props.age = age;

		this.props.timestamps.touch();
	}

	public get createdAt() {
		return this.props.timestamps.createdAt;
	}

	public get updatedAt() {
		return this.props.timestamps.updatedAt;
	}

	public toJSON() {
		return {
			id: this.id.id,
			name: this.name,
			age: this.age,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	public static create(
		props: Optional<TestEntityProps, "timestamps">,
		id = TestEntityId.create(),
	) {
		return new TestEntity(id, {
			...props,
			timestamps: props.timestamps ?? Timestamps.create(),
		});
	}
}
