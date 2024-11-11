import { z } from "zod";

export const userIdParamSchema = z.object({
	userId: z
		.string({ required_error: "O ID do usuário é obrigatório." })
		.uuid({ message: "O ID do usuário deve ser um UUID válido." }),
});

export type UserIdParamSchema = z.infer<typeof userIdParamSchema>;
