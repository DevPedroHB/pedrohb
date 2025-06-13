import { z } from "zod";

export const passwordPattern =
	/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!"@#$%^&*?]).{6,32}$/;

export const signUpCredentialsSchema = z
	.object({
		email: z.string().email(),
		password: z
			.string()
			.regex(passwordPattern, {
				message:
					"A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial.",
			})
			.min(6)
			.max(32),
		confirmPassword: z
			.string()
			.regex(passwordPattern, {
				message:
					"A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um dígito e um caractere especial.",
			})
			.min(6)
			.max(32),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "As senhas não coincidem.",
		path: ["confirmPassword"],
	});

export type SignUpCredentialsSchema = z.infer<typeof signUpCredentialsSchema>;
