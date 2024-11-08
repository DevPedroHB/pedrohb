import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const getUserByEmailParamSchema = z.object({
	email: z
		.string({
			required_error: "O parâmetro de e-mail é obrigatório.",
		})
		.email({ message: "O e-mail deve ser válido." }),
});

export class GetUserByEmailParamDto extends createZodDto(
	getUserByEmailParamSchema,
) {}
