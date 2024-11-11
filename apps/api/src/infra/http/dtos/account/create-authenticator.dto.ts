import { createZodDto } from "nestjs-zod";
import { createAuthenticatorBodySchema } from "../../schemas/account/create-authenticator-schema";
import { userIdParamSchema } from "../../schemas/account/user-id-param-schema";

export class CreateAuthenticatorParamDto extends createZodDto(
	userIdParamSchema,
) {}

export class CreateAuthenticatorBodyDto extends createZodDto(
	createAuthenticatorBodySchema,
) {}
