import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { TOptional } from "@/core/types/optional";

export interface ITestEntity {
	name: string;
	email: string;
	age: number;
	createdAt: Date;
}

export class TestEntity extends Entity<ITestEntity> {
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

	set createdAt(createdAt: Date) {
		this.props.createdAt = createdAt;
	}

	static create(
		props: TOptional<ITestEntity, "createdAt">,
		id?: UniqueEntityID,
	) {
		const testEntity = new TestEntity(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		return testEntity;
	}
}
