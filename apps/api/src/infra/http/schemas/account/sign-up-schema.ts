import { z } from "zod";

export const signUpBodySchema = z.object({
	name: z
		.string()
		.refine(
			(name: string) => {
				const trimmedName = name.trim();
				const nameParts = trimmedName.split(" ");

				if (nameParts.length < 2 || nameParts.some((part) => part.length < 3)) {
					return false;
				}

				return trimmedName;
			},
			{
				message:
					"O nome deve conter pelo menos um sobrenome, e ambos deve ter no mínimo 3 caracteres.",
			},
		)
		.nullish(),
	email: z
		.string({
			required_error: "O email é obrigatório.",
		})
		.email({ message: "O email deve ser um endereço de email válido." }),
	password: z
		.string()
		.min(6, { message: "A senha deve ter pelo menos 6 caracteres." })
		.max(32, { message: "A senha deve ter no máximo 32 caracteres." })
		.regex(/[A-Z]/, {
			message: "A senha deve conter pelo menos uma letra maiúscula.",
		})
		.regex(/[a-z]/, {
			message: "A senha deve conter pelo menos uma letra minúscula.",
		})
		.regex(/[0-9]/, { message: "A senha deve conter pelo menos um número." })
		.regex(/[^A-Za-z0-9]/, {
			message: "A senha deve conter pelo menos um caractere especial.",
		})
		.regex(/^\S*$/, { message: "A senha não pode conter espaços." })
		.nullish(),
	avatarUrl: z
		.string()
		.url({ message: "O URL do avatar deve ser um URL válido." })
		.nullish(),
	birthdate: z.coerce
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date"
						? "A data de nascimento deve ser uma data válida."
						: defaultError,
			}),
		})
		.nullish(),
	emailVerifiedAt: z.coerce
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date"
						? "A data de verificação do email deve ser uma data válida."
						: defaultError,
			}),
		})
		.nullish(),
});

export type SignUpBodySchema = z.infer<typeof signUpBodySchema>;
