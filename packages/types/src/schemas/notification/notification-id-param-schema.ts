import { z } from "zod";

export const notificationIdParamSchema = z.object({
	notificationId: z
		.string({ required_error: "O ID da notificação é obrigatório." })
		.uuid({ message: "O ID da notificação deve ser um UUID válido." }),
});

export type NotificationIdParamSchema = z.infer<
	typeof notificationIdParamSchema
>;
