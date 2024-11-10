import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const getAccountParamSchema = z.object({
	provider: z.string({
		required_error: "O parâmetro 'provider' é obrigatório.",
	}),
	providerAccountId: z.string({
		required_error: "O parâmetro 'providerAccountId' é obrigatório.",
	}),
});

export class GetAccountParamDto extends createZodDto(getAccountParamSchema) {}
