import { credentialIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class GetAuthenticatorParamDto extends createZodDto(
	credentialIdParamSchema,
) {}
