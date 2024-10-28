import type { Adapter } from "next-auth/adapters";

export function ApiAdapter(): Adapter {
	return {
		async createUser(user) {
			console.log(user);

			return user;
		},

		async getUser(id) {
			console.log(id);

			return null;
		},

		async getUserByEmail(email) {
			console.log(email);

			return null;
		},

		async getUserByAccount(providerAccountId) {
			console.log(providerAccountId);

			return null;
		},

		async updateUser(user) {
			console.log(user);

			return {
				id: user.id,
				name: user.name,
				email: user.email ?? "example@email.com",
				emailVerified: user.emailVerified ?? null,
				image: user.image,
			};
		},

		async deleteUser(userId) {
			console.log(userId);
		},

		async linkAccount(account) {
			console.log(account);

			return account;
		},

		async unlinkAccount(providerAccountId) {
			console.log(providerAccountId);
		},

		async createSession(session) {
			console.log(session);

			return session;
		},

		async getSessionAndUser(sessionToken) {
			console.log(sessionToken);

			return null;
		},

		async updateSession(session) {
			console.log(session);

			return null;
		},

		async deleteSession(sessionToken) {
			console.log(sessionToken);
		},

		async createVerificationToken(verificationToken) {
			console.log(verificationToken);

			return verificationToken;
		},

		async useVerificationToken(params) {
			console.log(params);

			return null;
		},

		async getAccount(providerAccountId, provider) {
			console.log({ providerAccountId, provider });

			return null;
		},

		async getAuthenticator(credentialID) {
			console.log(credentialID);

			return null;
		},

		async createAuthenticator(authenticator) {
			console.log(authenticator);

			return authenticator;
		},

		async listAuthenticatorsByUserId(userId) {
			console.log(userId);

			return [
				{
					providerAccountId: "string",
					counter: 1,
					credentialBackedUp: true,
					credentialID: "string",
					credentialPublicKey: "string",
					credentialDeviceType: "string",
					userId: "",
				},
			];
		},

		async updateAuthenticatorCounter(credentialID, newCounter) {
			console.log({ credentialID, newCounter });

			return {
				providerAccountId: "string",
				counter: 1,
				credentialBackedUp: true,
				credentialID: "string",
				credentialPublicKey: "string",
				credentialDeviceType: "string",
				userId: "",
			};
		},
	};
}
