"use server";

import { actionClient } from "@/libs/safe-action";
import { signInSchema } from "@/types/schemas/sign-in-schema";
import { redirect } from "next/navigation";

export const signInAction = actionClient
	.metadata({ actionName: "signInAction" })
	.inputSchema(signInSchema)
	.action(async ({ parsedInput: { email, password } }) => {
		redirect("/");
	});
