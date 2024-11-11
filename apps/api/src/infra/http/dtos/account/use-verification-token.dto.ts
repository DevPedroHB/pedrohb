import { createZodDto } from "nestjs-zod";
import { identifierTokenParamSchema } from "../../schemas/account/identifier-token-param-schema";

export class UseVerificationTokenDto extends createZodDto(
	identifierTokenParamSchema,
) {}
