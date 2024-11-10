import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const UpdateAuthenticatorCounterParamSchema = z.object({
	credentialId: z.string({
		required_error: "O campo 'credentialId' é obrigatório.",
	}),
});

export class UpdateAuthenticatorCounterParamDto extends createZodDto(
	UpdateAuthenticatorCounterParamSchema,
) {}

const UpdateAuthenticatorCounterBodySchema = z.object({
	counter: z.coerce
		.number({
			required_error: "O campo 'counter' é obrigatório.",
			invalid_type_error: "O campo 'counter' deve ser um número válido.",
		})
		.min(0, { message: "O campo 'counter' não pode ser negativo." }),
});

export class UpdateAuthenticatorCounterBodyDto extends createZodDto(
	UpdateAuthenticatorCounterBodySchema,
) {}
