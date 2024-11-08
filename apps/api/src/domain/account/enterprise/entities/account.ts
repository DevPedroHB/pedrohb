import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { TOptional } from "@/core/types/optional";

export interface IAccount {
	provider: string;
	providerAccountId: string;
	type: string;
	refreshToken?: string | null;
	accessToken?: string | null;
	expiresAt?: number | null;
	tokenType?: string | null;
	scope?: string | null;
	tokenId?: string | null;
	sessionState?: string | null;
	createdAt: Date;
	updatedAt?: Date | null;
	userId: UniqueEntityID;
}

export class Account extends Entity<IAccount> {
	get provider() {
		return this.props.provider;
	}

	get providerAccountId() {
		return this.props.providerAccountId;
	}

	get type() {
		return this.props.type;
	}

	get refreshToken() {
		return this.props.refreshToken;
	}

	get accessToken() {
		return this.props.accessToken;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	get tokenType() {
		return this.props.tokenType;
	}

	get scope() {
		return this.props.scope;
	}

	get tokenId() {
		return this.props.tokenId;
	}

	get sessionState() {
		return this.props.sessionState;
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

	static create(props: TOptional<IAccount, "createdAt">, id?: UniqueEntityID) {
		const account = new Account(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		);

		return account;
	}
}
