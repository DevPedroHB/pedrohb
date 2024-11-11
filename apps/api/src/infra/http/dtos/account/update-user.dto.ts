import { createZodDto } from "nestjs-zod";
import { updateUserBodySchema } from "../../schemas/account/update-user-schema";
import { userIdParamSchema } from "../../schemas/account/user-id-param-schema";

export class UpdateUserParamDto extends createZodDto(userIdParamSchema) {}

export class UpdateUserBodyDto extends createZodDto(updateUserBodySchema) {}
