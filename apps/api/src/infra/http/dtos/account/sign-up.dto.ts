import { createZodDto } from "nestjs-zod";
import { signUpBodySchema } from "../../schemas/account/sign-up-schema";

export class SignUpBodyDto extends createZodDto(signUpBodySchema) {}
