import { createZodDto } from "nestjs-zod";
import { credentialIdParamSchema } from "../../schemas/account/credential-id-param-schema";
import { updateAuthenticatorCounterBodySchema } from "../../schemas/account/update-authenticator-counter-schema";

export class UpdateAuthenticatorCounterParamDto extends createZodDto(
	credentialIdParamSchema,
) {}

export class UpdateAuthenticatorCounterBodyDto extends createZodDto(
	updateAuthenticatorCounterBodySchema,
) {}
