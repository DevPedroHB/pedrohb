import { createZodDto } from "nestjs-zod";
import { sessionTokenParamSchema } from "../../schemas/account/session-token-param-schema";

export class DeleteSessionParamDto extends createZodDto(
	sessionTokenParamSchema,
) {}
