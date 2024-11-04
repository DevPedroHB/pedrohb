import { VerificationToken } from "@/domain/account/enterprise/entities/verification-token";
import {
	Prisma,
	VerificationToken as PrismaVerificationToken,
} from "@prisma/client";

export class PrismaVerificationTokenMapper {
	static toDomain(
		verificationToken: PrismaVerificationToken,
	): VerificationToken {
		return VerificationToken.create({
			identifier: verificationToken.identifier,
			token: verificationToken.token,
			expiresAt: verificationToken.expiresAt,
		});
	}

	static toPrisma(
		verificationToken: VerificationToken,
	): Prisma.VerificationTokenUncheckedCreateInput {
		return {
			identifier: verificationToken.identifier,
			token: verificationToken.token,
			expiresAt: verificationToken.expiresAt,
		};
	}
}
