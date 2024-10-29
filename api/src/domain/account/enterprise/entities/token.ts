import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";
import { addMinutes } from "date-fns";
import { randomBytes } from "node:crypto";

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

	static generateToken(length = 6) {
		const otp = randomBytes(Math.ceil(length / 2))
			.toString("hex")
			.slice(0, length);

		return otp.toUpperCase();
	}

	static create(
		props: Optional<IToken, "token" | "expiresAt">,
		id?: UniqueEntityID,
	) {
		const token = new Token(
			{
				...props,
				token: props.token ?? Token.generateToken(),
				expiresAt: props.expiresAt ?? addMinutes(new Date(), 15),
			},
			id,
		);

		return token;
	}
}
