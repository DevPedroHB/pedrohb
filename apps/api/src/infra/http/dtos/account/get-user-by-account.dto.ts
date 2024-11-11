import { createZodDto } from "nestjs-zod";
import { providerAccountIdParamSchema } from "../../schemas/account/provider-account-id-param-schema";

export class GetUserByAccountParamDto extends createZodDto(
	providerAccountIdParamSchema,
) {}
