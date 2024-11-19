import { createAccountBodySchema, userIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class CreateAccountParamDto extends createZodDto(userIdParamSchema) {}

export class CreateAccountBodyDto extends createZodDto(
	createAccountBodySchema,
) {}
