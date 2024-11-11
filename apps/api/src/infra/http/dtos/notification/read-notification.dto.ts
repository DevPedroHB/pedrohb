import { createZodDto } from "nestjs-zod";
import { notificationIdParamSchema } from "../../schemas/notification/notification-id-param-schema";

export class ReadNotificationParamDto extends createZodDto(
	notificationIdParamSchema,
) {}
