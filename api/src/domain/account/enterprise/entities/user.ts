import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { UserCreatedEvent } from "../events/user-created-event";

export enum Roles {
	OWNER = "OWNER",
	CLIENT = "CLIENT",
	MEMBER = "MEMBER",
}

export interface IUser {
	name?: string | null;
	email: string;
	password?: string | null;
	avatarUrl?: string | null;
	birthdate?: Date | null;
	role: Roles;
	emailVerifiedAt?: Date | null;
	createdAt: Date;
	updatedAt?: Date | null;
}

export class User extends AggregateRoot<IUser> {
	get name() {
		return this.props.name;
	}

	get email() {
		return this.props.email;
	}

	get password() {
		return this.props.password;
	}

	get avatarUrl() {
		return this.props.avatarUrl;
	}

	get birthdate() {
		return this.props.birthdate;
	}

	get role() {
		return this.props.role;
	}

	get emailVerifiedAt() {
		return this.props.emailVerifiedAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	static create(
		props: Optional<IUser, "role" | "createdAt">,
		id?: UniqueEntityID,
	) {
		const user = new User(
			{
				...props,
				role: props.role ?? Roles.MEMBER,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		if (!id) {
			user.addDomainEvent(new UserCreatedEvent(user));
		}

		return user;
	}
}
