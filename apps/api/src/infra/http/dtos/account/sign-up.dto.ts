import { signUpBodySchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class SignUpBodyDto extends createZodDto(signUpBodySchema) {}
