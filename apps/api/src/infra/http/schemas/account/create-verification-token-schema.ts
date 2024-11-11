import { z } from "zod";

export const createVerificationTokenBodySchema = z.object({
	identifier: z.string({
		required_error: "O campo 'identifier' é obrigatório.",
	}),
	token: z.string().optional(),
	expiresAt: z.coerce
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date"
						? "A data de expiração deve ser uma data válida."
						: defaultError,
			}),
		})
		.optional(),
});

export type CreateVerificationTokenBodySchema = z.infer<
	typeof createVerificationTokenBodySchema
>;
