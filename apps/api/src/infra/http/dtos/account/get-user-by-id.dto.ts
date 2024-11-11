import { createZodDto } from "nestjs-zod";
import { userIdParamSchema } from "../../schemas/account/user-id-param-schema";

export class GetUserByIdParamDto extends createZodDto(userIdParamSchema) {}
