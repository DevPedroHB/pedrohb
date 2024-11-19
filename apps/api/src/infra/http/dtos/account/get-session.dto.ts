import { sessionTokenParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class GetSessionParamDto extends createZodDto(sessionTokenParamSchema) {}
