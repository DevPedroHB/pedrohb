import { z } from "zod";

export const passwordPattern =
	/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!"@#$%^&*?]).{6,32}$/;

export const signInSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.regex(passwordPattern, {
			message:
				"A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial.",
		})
		.min(6)
		.max(32),
});

export type SignInSchema = z.infer<typeof signInSchema>;
