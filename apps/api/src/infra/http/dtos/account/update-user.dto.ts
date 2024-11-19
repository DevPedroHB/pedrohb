import { updateUserBodySchema, userIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class UpdateUserParamDto extends createZodDto(userIdParamSchema) {}

export class UpdateUserBodyDto extends createZodDto(updateUserBodySchema) {}
