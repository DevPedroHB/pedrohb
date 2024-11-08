import { Roles } from "@/domain/account/enterprise/entities/user";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const updateUserParamSchema = z.object({
	userId: z
		.string({ required_error: "O ID do usuário é obrigatório." })
		.uuid({ message: "O ID do usuário deve ser um UUID válido." }),
});

export class UpdateUserParamDto extends createZodDto(updateUserParamSchema) {}

const updateUserBodySchema = z.object({
	name: z.string().nullish(),
	email: z
		.string()
		.email({ message: "O e-mail deve ser um endereço de e-mail válido." })
		.nullish(),
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
		.url({ message: "A URL do avatar deve ser um endereço válido." })
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
	role: z
		.nativeEnum(Roles, {
			message: "O valor do campo 'role' deve ser um dos valores permitidos.",
		})
		.nullish(),
	emailVerifiedAt: z.coerce
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date"
						? "A data de verificação do e-mail deve ser uma data válida."
						: defaultError,
			}),
		})
		.nullish(),
});

export class UpdateUserBodyDto extends createZodDto(updateUserBodySchema) {}