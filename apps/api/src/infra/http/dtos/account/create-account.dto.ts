import { createZodDto } from "nestjs-zod";
import { createAccountBodySchema } from "../../schemas/account/create-account-schema";
import { userIdParamSchema } from "../../schemas/account/user-id-param-schema";

export class CreateAccountParamDto extends createZodDto(userIdParamSchema) {}

export class CreateAccountBodyDto extends createZodDto(
	createAccountBodySchema,
) {}
