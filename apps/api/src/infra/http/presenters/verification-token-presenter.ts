import type { VerificationToken } from "@/domain/account/enterprise/entities/verification-token";

export class VerificationTokenPresenter {
	static toHTTP(verificationToken: VerificationToken) {
		return {
			identifier: verificationToken.identifier,
			token: verificationToken.token,
			expiresAt: verificationToken.expiresAt,
		};
	}
}
