import { createZodDto } from "nestjs-zod";
import { sessionTokenParamSchema } from "../../schemas/account/session-token-param-schema";
import { updateSessionBodySchema } from "../../schemas/account/update-session-schema";

export class UpdateSessionParamDto extends createZodDto(
	sessionTokenParamSchema,
) {}

export class UpdateSessionBodyDto extends createZodDto(
	updateSessionBodySchema,
) {}
