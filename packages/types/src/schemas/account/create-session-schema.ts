import { z } from "zod";

export const createSessionBodySchema = z.object({
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

export type CreateSessionBodySchema = z.infer<typeof createSessionBodySchema>;
