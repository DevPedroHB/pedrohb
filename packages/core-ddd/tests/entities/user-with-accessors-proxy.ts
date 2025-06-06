import { Entity } from "@/entities/entity";
import { UUID } from "@/entities/unique-entity-ids/uuid";
import type { Optional } from "@/types/optional";
import type { IUser } from "@tests/types/user";

export class UserWithAccessorsProxy extends Entity<IUser> {
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
		const userWithAccessorsProxy = new UserWithAccessorsProxy(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id ?? UUID.create(),
		);

		return userWithAccessorsProxy.withAccessorsProxy();
	}
}
