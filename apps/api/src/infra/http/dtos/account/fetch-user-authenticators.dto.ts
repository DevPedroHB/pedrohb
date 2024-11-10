import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const fetchUserAuthenticatorsParamSchema = z.object({
	userId: z
		.string({ required_error: "O ID do usuário é obrigatório." })
		.uuid({ message: "O ID do usuário deve ser um UUID válido." }),
});

export class FetchUserAuthenticatorsParamDto extends createZodDto(
	fetchUserAuthenticatorsParamSchema,
) {}
