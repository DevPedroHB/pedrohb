import { createZodDto } from "nestjs-zod";
import { credentialIdParamSchema } from "../../schemas/account/credential-id-param-schema";

export class GetAuthenticatorParamDto extends createZodDto(
	credentialIdParamSchema,
) {}
