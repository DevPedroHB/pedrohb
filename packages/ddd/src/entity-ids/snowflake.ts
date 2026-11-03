import {
	MaximumIncrement,
	MaximumProcessId,
	MaximumWorkerId,
	Snowflake as SapphireSnowflake,
} from "@sapphire/snowflake";
import { dddEnv } from "#/envs/ddd-env.js";
import { EntityId } from "./entity-id.js";

export const SNOWFLAKE_MAXIMUM_INCREMENT = MaximumIncrement;
export const SNOWFLAKE_MAXIMUM_PROCESS_ID = MaximumProcessId;
export const SNOWFLAKE_MAXIMUM_WORKER_ID = MaximumWorkerId;

export class Snowflake extends EntityId<bigint> {
	public static readonly snowflake = new SapphireSnowflake(
		dddEnv.DDD_SNOWFLAKE_EPOCH,
	);

	private constructor(id: bigint) {
		super(id);
	}

	public toJSON() {
		return {
			id: this.id.toString(),
		};
	}

	public isValid(id: bigint) {
		if (id < 0n || id > (1n << 63n) - 1n) {
			return false;
		}

		const { timestamp, epoch } = Snowflake.snowflake.deconstruct(id);

		if (epoch !== dddEnv.DDD_SNOWFLAKE_EPOCH) {
			return false;
		}

		return timestamp <= Date.now();
	}

	public static create(snowflake = Snowflake.snowflake.generate()) {
		return new Snowflake(snowflake);
	}
}
