import { Aggregate } from "@/entities/aggregate";
import { UUID } from "@/entities/unique-entity-ids/uuid";
import type { Optional } from "@/types/optional";
import { UserCreatedEvent } from "@tests/events/user-created-event";
import type { IUser } from "@tests/types/user";

export class UserAggregate extends Aggregate<IUser> {
	get name() {
		return this.props.name;
	}

	set name(name: string) {
		this.props.name = name;

		this.updated();
	}

	get age() {
		return this.props.age;
	}

	set age(age: number) {
		this.props.age = age;

		this.updated();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private updated(updatedAt = new Date()) {
		this.props.updatedAt = updatedAt;
	}

	public toObject() {
		return {
			id: this.id.toValue(),
			name: this.props.name,
			age: this.props.age,
			createdAt: this.props.createdAt,
			updatedAt: this.props.updatedAt,
		};
	}

	public static create(props: Optional<IUser, "createdAt">, id?: UUID) {
		const userAggregate = new UserAggregate(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id ?? UUID.create(),
		);

		if (!id) {
			userAggregate.addDomainEvent(new UserCreatedEvent(userAggregate));
		}

		return userAggregate;
	}
}
