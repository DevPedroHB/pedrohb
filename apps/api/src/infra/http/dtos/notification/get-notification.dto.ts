import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const getNotificationParamSchema = z.object({
	notificationId: z
		.string({ required_error: "O ID da notificação é obrigatório." })
		.uuid({ message: "O ID da notificação deve ser um UUID válido." }),
});

export class GetNotificationParamDto extends createZodDto(
	getNotificationParamSchema,
) {}
