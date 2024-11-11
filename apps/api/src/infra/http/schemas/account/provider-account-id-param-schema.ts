import { z } from "zod";

export const providerAccountIdParamSchema = z.object({
	provider: z.string({
		required_error: "O parâmetro 'provider' é obrigatório.",
	}),
	providerAccountId: z.string({
		required_error: "O parâmetro 'providerAccountId' é obrigatório.",
	}),
});

export type ProviderAccountIdParamSchema = z.infer<
	typeof providerAccountIdParamSchema
>;
