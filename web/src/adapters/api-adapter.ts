import type { Adapter } from "next-auth/adapters";

export function ApiAdapter(): Adapter {
	return {
		async createAuthenticator(authenticator) {},
		async createSession(session) {},
		async createUser(user) {},
		async createVerificationToken(verificationToken) {},
		async deleteSession(sessionToken) {},
		async deleteUser(userId) {},
		async getAccount(providerAccountId, provider) {},
		async getAuthenticator(credentialID) {},
		async getSessionAndUser(sessionToken) {},
		async getUser(id) {},
		async getUserByAccount(providerAccountId) {},
		async getUserByEmail(email) {},
		async linkAccount(account) {},
		async listAuthenticatorsByUserId(userId) {},
		async unlinkAccount(providerAccountId) {},
		async updateAuthenticatorCounter(credentialID, newCounter) {},
		async updateSession(session) {},
		async updateUser(user) {},
		async useVerificationToken(params) {},
	};
}
