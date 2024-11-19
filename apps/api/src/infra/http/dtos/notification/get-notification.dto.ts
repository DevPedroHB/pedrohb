import { notificationIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class GetNotificationParamDto extends createZodDto(
	notificationIdParamSchema,
) {}
