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

	set name(name: string | null | undefined) {
		if (name !== undefined) {
			this.props.name = name;

			this.touch();
		}
	}

	get email() {
		return this.props.email;
	}

	set email(email: string) {
		this.props.email = email;

		this.touch();
	}

	get password() {
		return this.props.password;
	}

	set password(password: string | null | undefined) {
		if (password !== undefined) {
			this.props.password = password;

			this.touch();
		}
	}

	get avatarUrl() {
		return this.props.avatarUrl;
	}

	set avatarUrl(avatarUrl: string | null | undefined) {
		if (avatarUrl !== undefined) {
			this.props.avatarUrl = avatarUrl;

			this.touch();
		}
	}

	get birthdate() {
		return this.props.birthdate;
	}

	set birthdate(birthdate: Date | null | undefined) {
		if (birthdate !== undefined) {
			this.props.birthdate = birthdate;

			this.touch();
		}
	}

	get role() {
		return this.props.role;
	}

	set role(role: Roles) {
		this.props.role = role;

		this.touch();
	}

	get emailVerifiedAt() {
		return this.props.emailVerifiedAt;
	}

	set emailVerifiedAt(emailVerifiedAt: Date | null | undefined) {
		if (emailVerifiedAt !== undefined) {
			this.props.emailVerifiedAt = emailVerifiedAt;

			this.touch();
		}
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private touch() {
		this.props.updatedAt = new Date();
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
