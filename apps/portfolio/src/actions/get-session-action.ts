"use server";

import { actionClient } from "@/libs/safe-action";

export const getSessionAction = actionClient
	.metadata({ actionName: "getSessionAction" })
	.action(async ({ ctx: { session } }) => {
		return {
			token: session.token,
		};
	});
