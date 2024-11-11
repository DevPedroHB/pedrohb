import { z } from "zod";

export const sessionTokenParamSchema = z.object({
	sessionToken: z.string({
		required_error: "O token da sessão é obrigatório.",
	}),
});

export type SessionTokenParamSchema = z.infer<typeof sessionTokenParamSchema>;
