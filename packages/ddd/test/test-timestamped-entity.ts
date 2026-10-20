import {
	createTimestamps,
	type Optional,
	TimestampedEntity,
	type TimestampedEntityProps,
} from "#/index.js";
import type { TestEntityProps } from "./test-entity.js";
import { TestEntityId } from "./test-entity-id.js";

export type TestTimestampedEntityProps = Omit<TestEntityProps, "timestamps"> &
	TimestampedEntityProps;

export class TestTimestampedEntity extends TimestampedEntity<
	TestEntityId,
	TestTimestampedEntityProps
> {
	protected constructor(id: TestEntityId, props: TestTimestampedEntityProps) {
		super(id, props);
	}

	public get name() {
		return this.props.name;
	}

	public set name(name) {
		this.props.name = name;

		this.touch();
	}

	public get age() {
		return this.props.age;
	}

	public set age(age) {
		this.props.age = age;

		this.touch();
	}

	public toJSON() {
		return {
			id: this.id.id,
			name: this.name,
			age: this.age,
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
		};
	}

	public static create(
		props: Optional<TestTimestampedEntityProps, "createdAt" | "updatedAt">,
		id = TestEntityId.create(),
	) {
		const timestamps = createTimestamps();

		return new TestTimestampedEntity(id, {
			...props,
			createdAt: props.createdAt ?? timestamps.createdAt,
			updatedAt: props.updatedAt ?? timestamps.updatedAt,
		});
	}
}
