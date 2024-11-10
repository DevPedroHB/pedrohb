import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createSessionParamSchema = z.object({
	userId: z
		.string({ required_error: "O ID do usuário é obrigatório." })
		.uuid({ message: "O ID do usuário deve ser um UUID válido." }),
});

export class CreateSessionParamDto extends createZodDto(
	createSessionParamSchema,
) {}

const createSessionBodySchema = z.object({
	sessionToken: z.string({
		required_error: "O token da sessão é obrigatório.",
	}),
	expiresAt: z.coerce.date({
		errorMap: (issue, { defaultError }) => ({
			message:
				issue.code === "invalid_date"
					? "A data de expiração deve ser uma data válida."
					: defaultError,
		}),
	}),
});

export class CreateSessionBodyDto extends createZodDto(
	createSessionBodySchema,
) {}
