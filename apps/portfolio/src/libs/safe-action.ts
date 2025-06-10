import { getTranslations } from "next-intl/server";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

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
}).use(async ({ next, clientInput, metadata }) => {
	console.log("LOGGING MIDDLEWARE");

	const startTime = performance.now();
	const result = await next();
	const endTime = performance.now();

	console.log("Result ->", result);
	console.log("Client input ->", clientInput);
	console.log("Metadata ->", metadata);
	console.log("Action execution took", endTime - startTime, "ms");

	return result;
});
