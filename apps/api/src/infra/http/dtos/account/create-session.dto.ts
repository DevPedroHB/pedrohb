import { createZodDto } from "nestjs-zod";
import { createSessionBodySchema } from "../../schemas/account/create-session-schema";
import { userIdParamSchema } from "../../schemas/account/user-id-param-schema";

export class CreateSessionParamDto extends createZodDto(userIdParamSchema) {}

export class CreateSessionBodyDto extends createZodDto(
	createSessionBodySchema,
) {}
