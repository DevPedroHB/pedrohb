import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { TOptional } from "@/core/types/optional";

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

	set sessionToken(sessionToken: string) {
		this.props.sessionToken = sessionToken;

		this.touch();
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	set expiresAt(expiresAt: Date) {
		this.props.expiresAt = expiresAt;

		this.touch();
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

	set userId(userId: UniqueEntityID) {
		this.props.userId = userId;

		this.touch();
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	static create(props: TOptional<ISession, "createdAt">, id?: UniqueEntityID) {
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
