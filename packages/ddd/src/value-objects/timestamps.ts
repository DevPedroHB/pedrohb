import { DDDError } from "#/errors/ddd-error.js";
import { ValueObject } from "./value-object.js";

export type TimestampsProps = {
	createdAt: number;
	updatedAt: number;
};

export class Timestamps extends ValueObject<TimestampsProps> {
	protected constructor({ createdAt, updatedAt }: TimestampsProps) {
		if (
			!Number.isInteger(createdAt) ||
			!Number.isInteger(updatedAt) ||
			updatedAt < createdAt
		) {
			throw new DDDError("INVALID_TIMESTAMPS", {
				params: {
					createdAt: String(createdAt),
					updatedAt: String(updatedAt),
				},
				cause: { createdAt, updatedAt },
			});
		}

		super({ createdAt, updatedAt });
	}

	public get createdAt() {
		return new Date(this.props.createdAt);
	}

	public get updatedAt() {
		return new Date(this.props.updatedAt);
	}

	public toJSON() {
		return {
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt.toISOString(),
		};
	}

	public touch(now = new Date()) {
		const updatedAt = Math.max(now.getTime(), this.props.updatedAt);

		return new Timestamps({ createdAt: this.props.createdAt, updatedAt });
	}

	public static restore(createdAt: Date, updatedAt: Date) {
		return new Timestamps({
			createdAt: createdAt.getTime(),
			updatedAt: updatedAt.getTime(),
		});
	}

	public static create(now = new Date()) {
		const ms = now.getTime();

		return new Timestamps({ createdAt: ms, updatedAt: ms });
	}
}
