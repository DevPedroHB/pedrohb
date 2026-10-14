import {
	createTimestamps,
	type Optional,
	TimestampedEntity,
	type TimestampsEntity,
} from "#/index.js";
import type { TestEntityProps } from "./test-entity.js";
import { TestEntityId } from "./test-entity-id.js";

export type TestTimestampedEntityProps = TestEntityProps & TimestampsEntity;

export class TestTimestampedEntity extends TimestampedEntity<
	TestEntityId,
	TestTimestampedEntityProps
> {
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
			...this.id.toJSON(),
			...this.props,
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
