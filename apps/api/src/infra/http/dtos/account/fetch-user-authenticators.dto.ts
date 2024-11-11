import { createZodDto } from "nestjs-zod";
import { userIdParamSchema } from "../../schemas/account/user-id-param-schema";

export class FetchUserAuthenticatorsParamDto extends createZodDto(
	userIdParamSchema,
) {}
