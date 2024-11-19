import { createSessionBodySchema, userIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class CreateSessionParamDto extends createZodDto(userIdParamSchema) {}

export class CreateSessionBodyDto extends createZodDto(
	createSessionBodySchema,
) {}
