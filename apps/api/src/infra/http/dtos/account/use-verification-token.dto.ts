import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const useVerificationTokenSchema = z.object({
	identifier: z.string({
		required_error: "O campo 'identifier' é obrigatório.",
	}),
	token: z.string({
		required_error: "O campo 'token' é obrigatório.",
	}),
});

export class UseVerificationTokenDto extends createZodDto(
	useVerificationTokenSchema,
) {}
