import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const getSessionParamSchema = z.object({
	sessionToken: z.string({
		required_error: "O token da sessão é obrigatório.",
	}),
});

export class GetSessionParamDto extends createZodDto(getSessionParamSchema) {}
