import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createVerificationTokenBodySchema = z.object({
	identifier: z.string({
		required_error: "O campo 'identifier' é obrigatório.",
	}),
	token: z.string().nullish(),
	expiresAt: z.coerce
		.date({
			errorMap: (issue, { defaultError }) => ({
				message:
					issue.code === "invalid_date"
						? "A data de expiração deve ser uma data válida."
						: defaultError,
			}),
		})
		.nullish(),
});

export class CreateVerificationTokenBodyDto extends createZodDto(
	createVerificationTokenBodySchema,
) {}
