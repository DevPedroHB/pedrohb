import { z } from "zod";

export const identifierTokenParamSchema = z.object({
	identifier: z.string({
		required_error: "O campo 'identifier' é obrigatório.",
	}),
	token: z.string({
		required_error: "O campo 'token' é obrigatório.",
	}),
});

export type IdentifierTokenParamSchema = z.infer<
	typeof identifierTokenParamSchema
>;
