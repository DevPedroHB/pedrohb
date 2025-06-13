"use server";

import { actionClient } from "@/libs/safe-action";
import { RedirectType, redirect } from "next/navigation";

export const signOutAction = actionClient
	.metadata({ actionName: "signOutAction" })
	.action(async ({ ctx: { session } }) => {
		await session.destroy();

		return redirect("/", RedirectType.replace);
	});
