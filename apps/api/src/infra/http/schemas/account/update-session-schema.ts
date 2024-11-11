import { z } from "zod";

export const updateSessionBodySchema = z.object({
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

export type UpdateSessionBodySchema = z.infer<typeof updateSessionBodySchema>;
