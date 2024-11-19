import { providerAccountIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class GetAccountParamDto extends createZodDto(
	providerAccountIdParamSchema,
) {}
