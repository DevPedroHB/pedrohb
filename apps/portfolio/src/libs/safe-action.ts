import { getIronSession } from "iron-session";
import { getTranslations } from "next-intl/server";
import { createMiddleware, createSafeActionClient } from "next-safe-action";
import { cookies } from "next/headers";
import { z } from "zod";
import { type SessionData, sessionOptions } from "./iron-session";

const loggingMiddleware = createMiddleware().define(
	async ({ next, clientInput, metadata }) => {
		const startTime = performance.now();
		const result = await next();
		const endTime = performance.now();

		console.log("Result ->", result);
		console.log("Client input ->", clientInput);
		console.log("Metadata ->", metadata);
		console.log(`Action execution took ${endTime - startTime} ms`);

		return result;
	},
);

const sessionMiddleware = createMiddleware().define(async ({ next }) => {
	const cookiesStore = await cookies();

	const session = await getIronSession<SessionData>(
		cookiesStore,
		sessionOptions,
	);

	return next({
		ctx: {
			session,
		},
	});
});

export const actionClient = createSafeActionClient({
	defaultValidationErrorsShape: "flattened",
	defineMetadataSchema() {
		return z.object({
			actionName: z.string(),
		});
	},
	async handleServerError(e) {
		const t = await getTranslations("libs.safe_action");

		if (e instanceof Error) {
			return e.message;
		}

		return t("server_error");
	},
})
	.use(loggingMiddleware)
	.use(sessionMiddleware);
