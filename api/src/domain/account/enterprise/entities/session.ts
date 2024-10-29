import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export interface ISession {
	sessionToken: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt?: Date | null;
	userId: UniqueEntityID;
}

export class Session extends Entity<ISession> {
	get sessionToken() {
		return this.props.sessionToken;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get userId() {
		return this.props.userId;
	}

	static create(props: Optional<ISession, "createdAt">, id?: UniqueEntityID) {
		const session = new Session(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		return session;
	}
}
