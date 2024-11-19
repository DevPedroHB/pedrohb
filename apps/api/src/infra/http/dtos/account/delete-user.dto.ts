import { userIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class DeleteUserParamDto extends createZodDto(userIdParamSchema) {}
