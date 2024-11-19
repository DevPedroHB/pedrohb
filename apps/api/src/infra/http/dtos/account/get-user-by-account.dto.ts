import { providerAccountIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class GetUserByAccountParamDto extends createZodDto(
	providerAccountIdParamSchema,
) {}
