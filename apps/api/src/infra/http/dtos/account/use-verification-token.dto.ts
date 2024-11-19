import { identifierTokenParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class UseVerificationTokenDto extends createZodDto(
	identifierTokenParamSchema,
) {}
