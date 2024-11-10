import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const updateSessionParamSchema = z.object({
	sessionToken: z.string({
		required_error: "O token da sessão é obrigatório.",
	}),
});

export class UpdateSessionParamDto extends createZodDto(
	updateSessionParamSchema,
) {}

const updateSessionBodySchema = z.object({
	expiresAt: z.coerce
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date"
						? "A data de expiração deve ser uma data válida."
						: defaultError,
			}),
		})
		.nullish(),
	userId: z
		.string()
		.uuid({ message: "O ID do usuário deve ser um UUID válido." })
		.nullish(),
});

export class UpdateSessionBodyDto extends createZodDto(
	updateSessionBodySchema,
) {}
