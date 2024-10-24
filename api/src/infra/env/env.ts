import { z } from "zod";

export const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string().url(),
	REDIS_HOST: z.string(),
	REDIS_PASSWORD: z.string(),
	REDIS_PORT: z.coerce.number(),
	REDIS_DB: z.coerce.number(),
	JWT_PRIVATE_KEY: z.string(),
	JWT_PUBLIC_KEY: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
