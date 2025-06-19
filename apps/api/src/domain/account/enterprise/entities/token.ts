import { Entity, NullableToOptional, Optional, UUID } from "@pedrohb/core-ddd";
import { Token as PrismaToken, TokenType } from "@pedrohb/db";

export interface IToken extends NullableToOptional<Omit<PrismaToken, "id">> {}

export class Token extends Entity<IToken> {
	get type() {
		return this.props.type;
	}

	set type(type: TokenType) {
		this.props.type = type;
	}

	get token() {
		return this.props.token;
	}

	set token(token: string) {
		this.props.token = token;
	}

	get expiresAt() {
		return this.props.expiresAt;
	}

	set expiresAt(expiresAt: Date) {
		this.props.expiresAt = expiresAt;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	public toObject() {
		return {
			id: this.id.toValue(),
			...this.props,
		};
	}

	public static generateOTPCode() {
		const code = (Math.floor(Math.random() * 900000) + 100000).toString();

		return code;
	}

	public static create(props: Optional<IToken, "createdAt">, id?: UUID) {
		const token = new Token(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id ?? UUID.create(),
		);

		return token;
	}
}
