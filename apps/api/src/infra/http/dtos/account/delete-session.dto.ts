import { sessionTokenParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class DeleteSessionParamDto extends createZodDto(
	sessionTokenParamSchema,
) {}
