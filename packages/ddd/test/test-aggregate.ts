import { Aggregate, type EntityId } from "#/index.js";
import { TestDomainEvent } from "./test-domain-event.js";
import type { TestEntityProps } from "./test-entity.js";
import { TestEntityId } from "./test-entity-id.js";

export class TestAggregate extends Aggregate<TestEntityId, TestEntityProps> {
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
			id: this.id.id,
			name: this.name,
			age: this.age,
		};
	}

	public addNewDomainEvent(
		occurredAt = new Date(),
		id: EntityId = TestEntityId.create(),
		aggregate: TestAggregate = this,
	) {
		const domainEvent = TestDomainEvent.create(aggregate, occurredAt, id);

		this.addDomainEvent(domainEvent);

		return domainEvent;
	}

	public static create(props: TestEntityProps, id?: TestEntityId) {
		const testAggregate = new TestAggregate(id ?? TestEntityId.create(), props);

		if (!id) {
			testAggregate.addDomainEvent(TestDomainEvent.create(testAggregate));
		}

		return testAggregate;
	}
}
