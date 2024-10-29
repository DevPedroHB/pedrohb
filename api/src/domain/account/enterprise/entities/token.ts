import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { addMinutes } from "date-fns";

export interface IToken {
	identifier: string;
	token: string;
	expiresAt: Date;
}

export class Token extends Entity<IToken> {
	get identifier() {
		return this.props.identifier;
	}

	get token() {
		return this.props.token;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	static create(props: Optional<IToken, "expiresAt">, id?: UniqueEntityID) {
		const token = new Token(
			{
				...props,
				expiresAt: props.expiresAt ?? addMinutes(new Date(), 15),
			},
			id,
		);

		return token;
	}
}
