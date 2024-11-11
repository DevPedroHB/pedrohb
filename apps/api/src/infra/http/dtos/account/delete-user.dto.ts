import { createZodDto } from "nestjs-zod";
import { userIdParamSchema } from "../../schemas/account/user-id-param-schema";

export class DeleteUserParamDto extends createZodDto(userIdParamSchema) {}
