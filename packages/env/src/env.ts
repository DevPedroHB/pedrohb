import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		DATABASE_URL: z.string().url(),
		JWT_SECRET: z.string(),
		COOKIES_SECRET: z.string(),
	},
	clientPrefix: "NEXT_PUBLIC_",
	client: {},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
