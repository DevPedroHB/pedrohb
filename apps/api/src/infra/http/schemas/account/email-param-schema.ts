import { z } from "zod";

export const emailParamSchema = z.object({
	email: z
		.string({
			required_error: "O parâmetro de e-mail é obrigatório.",
		})
		.email({ message: "O e-mail deve ser válido." }),
});

export type EmailParamSchema = z.infer<typeof emailParamSchema>;
