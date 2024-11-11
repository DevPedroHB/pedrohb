import { z } from "zod";

export const createAuthenticatorBodySchema = z.object({
	credentialId: z.string({
		required_error: "O campo 'credentialId' é obrigatório.",
	}),
	providerAccountId: z.string({
		required_error: "O campo 'providerAccountId' é obrigatório.",
	}),
	credentialPublicKey: z.string({
		required_error: "O campo 'credentialPublicKey' é obrigatório.",
	}),
	counter: z.coerce
		.number({
			required_error: "O campo 'counter' é obrigatório.",
			invalid_type_error: "O campo 'counter' deve ser um número válido.",
		})
		.min(0, { message: "O campo 'counter' não pode ser negativo." }),
	credentialDeviceType: z.string({
		required_error: "O campo 'credentialDeviceType' é obrigatório.",
	}),
	credentialBackedUp: z.boolean({
		required_error: "O campo 'credentialBackedUp' é obrigatório.",
		invalid_type_error:
			"O campo 'credentialBackedUp' deve ser um valor boolean.",
	}),
	transports: z.string().nullish(),
});

export type CreateAuthenticatorBodySchema = z.infer<
	typeof createAuthenticatorBodySchema
>;
