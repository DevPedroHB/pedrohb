import { createZodDto } from "nestjs-zod";
import { createVerificationTokenBodySchema } from "../../schemas/account/create-verification-token-schema";

export class CreateVerificationTokenBodyDto extends createZodDto(
	createVerificationTokenBodySchema,
) {}
