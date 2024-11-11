import { z } from "zod";

export const credentialIdParamSchema = z.object({
	credentialId: z.string({
		required_error: "O campo 'credentialId' é obrigatório.",
	}),
});

export type CredentialIdParamSchema = z.infer<typeof credentialIdParamSchema>;
