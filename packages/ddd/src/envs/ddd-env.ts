import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { DDDError } from "#/errors/ddd-error.js";

z.config(z.locales.ptBR());

export const dddEnv = createEnv({
	emptyStringAsUndefined: true,
	runtimeEnv: process.env,
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		DDD_SNOWFLAKE_EPOCH: z.coerce
			.bigint()
			.default(BigInt(new Date("2002-03-18T00:00:00.000Z").getTime())),
	},
	extends: [],
	onInvalidAccess(variable) {
		throw new DDDError("ENV_INVALID_ACCESS", {
			params: { variable },
		});
	},
	onValidationError(issues) {
		const error = new z.ZodError(
			issues.map((issue) => ({
				code: "custom",
				message: issue.message,
				path: (issue.path ?? []).map((segment) =>
					typeof segment === "object" ? segment.key : segment,
				),
			})),
		);

		throw new DDDError("ENV_VALIDATION_FAILED", {
			params: {
				issues: z.prettifyError(error),
			},
			cause: issues,
		});
	},
});
