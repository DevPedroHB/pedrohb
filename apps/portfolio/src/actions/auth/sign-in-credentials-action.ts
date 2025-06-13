"use server";

import { actionClient } from "@/libs/safe-action";
import { signInCredentialsSchema } from "@/types/schemas/sign-in-credentials-schema";
import { RedirectType, redirect } from "next/navigation";

export const signInCredentialsAction = actionClient
	.metadata({ actionName: "signInAction" })
	.inputSchema(signInCredentialsSchema)
	.action(async ({ parsedInput: { email, password }, ctx: { session } }) => {
		session.token = JSON.stringify({ email, password });

		await session.save();

		return redirect("/", RedirectType.replace);
	});
