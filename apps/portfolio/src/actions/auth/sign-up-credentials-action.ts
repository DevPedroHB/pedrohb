"use server";

import { actionClient } from "@/libs/safe-action";
import { signUpCredentialsSchema } from "@/types/schemas/sign-up-credentials-schema";
import { RedirectType, redirect } from "next/navigation";

export const signUpCredentialsAction = actionClient
	.metadata({ actionName: "signInAction" })
	.inputSchema(signUpCredentialsSchema)
	.action(
		async ({
			parsedInput: { email, password, confirmPassword },
			ctx: { session },
		}) => {
			session.token = JSON.stringify({ email, password, confirmPassword });

			await session.save();

			return redirect("/auth/otp", RedirectType.replace);
		},
	);
