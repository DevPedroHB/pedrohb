import { providerAccountIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class DeleteAccountParamDto extends createZodDto(
	providerAccountIdParamSchema,
) {}
