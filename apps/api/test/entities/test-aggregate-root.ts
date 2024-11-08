import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import type { TOptional } from "@/core/types/optional";
import { ITestEntity } from "./test-entity";

export class TestAggregateRoot extends AggregateRoot<ITestEntity> {
	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;
	}

	get email() {
		return this.props.email;
	}

	set email(email: string) {
		this.props.email = email;
	}

	get age() {
		return this.props.age;
	}

	set age(age: number) {
		this.props.age = age;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(
		props: TOptional<ITestEntity, "createdAt">,
		id?: UniqueEntityID,
	) {
		const testDomainEvents = new TestAggregateRoot(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		testDomainEvents.addDomainEvent(
			new TestAggregateRootEvent(testDomainEvents),
		);

		return testDomainEvents;
	}
}

export class TestAggregateRootEvent implements DomainEvent {
	private aggregate: TestAggregateRoot;
	public ocurredAt: Date;

	constructor(aggregate: TestAggregateRoot) {
		this.aggregate = aggregate;
		this.ocurredAt = new Date();
	}

	public getAggregateId(): UniqueEntityID {
		return this.aggregate.id;
	}
}
