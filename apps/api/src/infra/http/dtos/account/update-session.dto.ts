import {
	sessionTokenParamSchema,
	updateSessionBodySchema,
} from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class UpdateSessionParamDto extends createZodDto(
	sessionTokenParamSchema,
) {}

export class UpdateSessionBodyDto extends createZodDto(
	updateSessionBodySchema,
) {}
