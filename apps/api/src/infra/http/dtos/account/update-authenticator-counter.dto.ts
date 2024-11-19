import {
	credentialIdParamSchema,
	updateAuthenticatorCounterBodySchema,
} from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class UpdateAuthenticatorCounterParamDto extends createZodDto(
	credentialIdParamSchema,
) {}

export class UpdateAuthenticatorCounterBodyDto extends createZodDto(
	updateAuthenticatorCounterBodySchema,
) {}
