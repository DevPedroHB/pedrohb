import { notificationIdParamSchema } from "@pedrohb/types";
import { createZodDto } from "nestjs-zod";

export class ReadNotificationParamDto extends createZodDto(
	notificationIdParamSchema,
) {}
