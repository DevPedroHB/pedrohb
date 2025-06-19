import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		DATABASE_URL: z.string().url(),
		JWT_PRIVATE_KEY: z.string().base64(),
		JWT_PUBLIC_KEY: z.string().base64(),
		AUTH_SECRET: z.string().min(32).base64(),
		AUTH_GITHUB_ID: z.string(),
		AUTH_GITHUB_SECRET: z.string(),
		AUTH_GITHUB_CALLBACK_URL: z.string().url(),
	},
	clientPrefix: "NEXT_PUBLIC_",
	client: {},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});
