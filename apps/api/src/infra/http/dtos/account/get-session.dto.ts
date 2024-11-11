import { createZodDto } from "nestjs-zod";
import { sessionTokenParamSchema } from "../../schemas/account/session-token-param-schema";

export class GetSessionParamDto extends createZodDto(sessionTokenParamSchema) {}
