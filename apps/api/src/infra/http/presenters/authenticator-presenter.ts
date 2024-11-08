import { Authenticator } from "@/domain/account/enterprise/entities/authenticator";

export class AuthenticatorPresenter {
	static toHTTP(authenticator: Authenticator) {
		return {
			credentialId: authenticator.credentialId,
			providerAccountId: authenticator.providerAccountId,
			credentialPublicKey: authenticator.credentialPublicKey,
			counter: authenticator.counter,
			credentialDeviceType: authenticator.credentialDeviceType,
			credentialBackedUp: authenticator.credentialBackedUp,
			transports: authenticator.transports,
			userId: authenticator.userId.id,
		};
	}
}
