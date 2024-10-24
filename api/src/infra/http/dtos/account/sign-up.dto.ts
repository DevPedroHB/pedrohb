import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const signUpBodySchema = z.object({
	name: z.string().nullish(),
	email: z.string().email(),
	password: z.string().nullish(),
	avatarUrl: z.string().nullish(),
	birthdate: z.date().nullish(),
	emailVerifiedAt: z.date().nullish(),
});

export class SignUpBodyDto extends createZodDto(signUpBodySchema) {}
