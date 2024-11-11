import { createZodDto } from "nestjs-zod";
import { emailParamSchema } from "../../schemas/account/email-param-schema";

export class GetUserByEmailParamDto extends createZodDto(emailParamSchema) {}
