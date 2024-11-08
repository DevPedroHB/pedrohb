import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createAccountParamSchema = z.object({
	userId: z
		.string({ required_error: "O ID do usuário é obrigatório." })
		.uuid({ message: "O ID do usuário deve ser um UUID válido." }),
});

export class CreateAccountParamDto extends createZodDto(
	createAccountParamSchema,
) {}

const createAccountBodySchema = z.object({
	provider: z.string({
		required_error: "O campo 'provider' é obrigatório.",
	}),
	providerAccountId: z.string({
		required_error: "O campo 'providerAccountId' é obrigatório.",
	}),
	type: z.string({
		required_error: "O campo 'type' é obrigatório.",
	}),
	refreshToken: z.string().nullish(),
	accessToken: z.string().nullish(),
	expiresAt: z.coerce
		.number({
			invalid_type_error: "O campo 'expiresAt' deve ser um número válido.",
		})
		.nullish(),
	tokenType: z.string().nullish(),
	scope: z.string().nullish(),
	tokenId: z.string().nullish(),
});

export class CreateAccountBodyDto extends createZodDto(
	createAccountBodySchema,
) {}
