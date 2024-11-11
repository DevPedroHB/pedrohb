import { z } from "zod";

export const updateAuthenticatorCounterBodySchema = z.object({
	counter: z.coerce
		.number({
			required_error: "O campo 'counter' é obrigatório.",
			invalid_type_error: "O campo 'counter' deve ser um número válido.",
		})
		.min(0, { message: "O campo 'counter' não pode ser negativo." }),
});

export type UpdateAuthenticatorCounterBodySchema = z.infer<
	typeof updateAuthenticatorCounterBodySchema
>;
