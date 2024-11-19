import { userIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class GetUserByIdParamDto extends createZodDto(userIdParamSchema) {}
