import { z } from "zod";
import { DDDError } from "#/errors/ddd-error.js";
import { ValueObject } from "./value-object.js";

export type EmailProps = {
	email: string;
};

export class Email extends ValueObject<EmailProps> {
	private constructor(props: EmailProps) {
		super(props);
	}

	public get email() {
		return this.props.email;
	}

	public toJSON() {
		return {
			email: this.email,
		};
	}

	public static isValid(email: string) {
		return z.email().safeParse(email).success;
	}

	public static create(email: string) {
		if (!Email.isValid(email)) {
			throw new DDDError("INVALID_EMAIL", {
				params: {
					email,
				},
				cause: email,
			});
		}

		return new Email({ email });
	}
}
