import {
	Entity,
	NullableToOptional,
	Optional,
	Password,
	UUID,
} from "@pedrohb/core-ddd";
import { User as PrismaUser, Role } from "@pedrohb/db";

export interface IUser
	extends NullableToOptional<Omit<PrismaUser, "id" | "passwordHash">> {
	passwordHash?: Password | null;
}

export class User extends Entity<IUser> {
	get name() {
		return this.props.name;
	}

	set name(name: string | null | undefined) {
		this.props.name = name;

		this.update();
	}

	get email() {
		return this.props.email;
	}

	set email(email: string) {
		this.props.email = email;

		this.update();
	}

	get passwordHash() {
		return this.props.passwordHash;
	}

	set passwordHash(passwordHash: Password | null | undefined) {
		this.props.passwordHash = passwordHash;

		this.update();
	}

	get avatarUrl() {
		return this.props.avatarUrl;
	}

	set avatarUrl(avatarUrl: string | null | undefined) {
		this.props.avatarUrl = avatarUrl;

		this.update();
	}

	get roles() {
		return this.props.roles;
	}

	set roles(roles: Role[]) {
		this.props.roles = roles;

		this.update();
	}

	get emailVerifiedAt() {
		return this.props.emailVerifiedAt;
	}

	set emailVerifiedAt(emailVerifiedAt: Date | null | undefined) {
		this.props.emailVerifiedAt = emailVerifiedAt;

		this.update();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	private update() {
		this.props.updatedAt = new Date();
	}

	public verifyEmail() {
		this.props.emailVerifiedAt = new Date();

		this.update();
	}

	public toObject() {
		return {
			id: this.id.toValue(),
			...this.props,
		};
	}

	public static create(
		props: Optional<IUser, "roles" | "createdAt">,
		id?: UUID,
	) {
		const user = new User(
			{
				...props,
				roles: [Role.MEMBER, ...(props.roles ?? [])],
				createdAt: props.createdAt ?? new Date(),
			},
			id ?? UUID.create(),
		);

		return user;
	}
}
