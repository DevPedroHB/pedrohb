import {
	createAuthenticatorBodySchema,
	userIdParamSchema,
} from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class CreateAuthenticatorParamDto extends createZodDto(
	userIdParamSchema,
) {}

export class CreateAuthenticatorBodyDto extends createZodDto(
	createAuthenticatorBodySchema,
) {}
