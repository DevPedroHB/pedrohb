import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const deleteSessionParamSchema = z.object({
	sessionToken: z.string({
		required_error: "O token da sessão é obrigatório.",
	}),
});

export class DeleteSessionParamDto extends createZodDto(
	deleteSessionParamSchema,
) {}
