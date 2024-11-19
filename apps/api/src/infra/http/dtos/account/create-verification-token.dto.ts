import { createVerificationTokenBodySchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class CreateVerificationTokenBodyDto extends createZodDto(
	createVerificationTokenBodySchema,
) {}
