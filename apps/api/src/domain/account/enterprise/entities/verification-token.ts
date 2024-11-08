import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { TOptional } from "@/core/types/optional";
import { addMinutes } from "date-fns";
import { randomBytes } from "node:crypto";

export interface IVerificationToken {
	identifier: string;
	token: string;
	expiresAt: Date;
}

export class VerificationToken extends Entity<IVerificationToken> {
	get identifier() {
		return this.props.identifier;
	}

	get token() {
		return this.props.token;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	static generateVerificationToken(length = 6) {
		const otp = randomBytes(Math.ceil(length / 2))
			.toString("hex")
			.slice(0, length);

		return otp.toUpperCase();
	}

	static create(
		props: TOptional<IVerificationToken, "token" | "expiresAt">,
		id?: UniqueEntityID,
	) {
		const verificationToken = new VerificationToken(
			{
				...props,
				token: props.token ?? VerificationToken.generateVerificationToken(),
				expiresAt: props.expiresAt ?? addMinutes(new Date(), 15),
			},
			id,
		);

		return verificationToken;
	}
}
