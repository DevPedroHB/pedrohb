import { z } from "zod";

export const authenticationTokenPayloadSchema = z.object({
	sub: z.string().uuid(),
});

export type AuthenticationTokenPayload = z.infer<
	typeof authenticationTokenPayloadSchema
>;
