import { userIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class FetchUserAuthenticatorsParamDto extends createZodDto(
	userIdParamSchema,
) {}
