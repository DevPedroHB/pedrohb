import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const getAuthenticatorParamSchema = z.object({
	credentialId: z.string({
		required_error: "O campo 'credentialId' é obrigatório.",
	}),
});

export class GetAuthenticatorParamDto extends createZodDto(
	getAuthenticatorParamSchema,
) {}
