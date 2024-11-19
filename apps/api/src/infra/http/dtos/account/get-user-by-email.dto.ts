import { emailParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class GetUserByEmailParamDto extends createZodDto(emailParamSchema) {}
