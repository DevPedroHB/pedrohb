import { Entity } from "@/entities/entity";
import { UUID } from "@/entities/unique-entity-ids/uuid";
import type { Optional } from "@/types/optional";
import type { IUser } from "@tests/types/user";

export class UserEntity extends Entity<IUser> {
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
		const userEntity = new UserEntity(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id ?? UUID.create(),
		);

		return userEntity;
	}
}
