import type {
	Adapter,
	AdapterAuthenticator,
	AdapterSession,
	AdapterUser,
} from "next-auth/adapters";

export function ApiAdapter(): Adapter {
	return {
		createAuthenticator(authenticator) {
			console.log(authenticator);

			return authenticator;
		},
		createSession(session) {
			console.log(session);

			return session;
		},
		createUser(user) {
			console.log(user);

			return user;
		},
		createVerificationToken(verificationToken) {
			console.log(verificationToken);

			return verificationToken;
		},
		async deleteSession(sessionToken) {
			console.log(sessionToken);
		},
		async deleteUser(userId) {
			console.log(userId);
		},
		getAccount(providerAccountId, provider) {
			console.log(providerAccountId, provider);

			return null;
		},
		getAuthenticator(credentialID) {
			console.log(credentialID);

			return null;
		},
		getSessionAndUser(sessionToken) {
			console.log(sessionToken);

			return null;
		},
		getUser(id) {
			console.log(id);

			return null;
		},
		getUserByAccount(providerAccountId) {
			console.log(providerAccountId);

			return null;
		},
		getUserByEmail(email) {
			console.log(email);

			return null;
		},
		async linkAccount(account) {
			console.log(account);
		},
		listAuthenticatorsByUserId(userId) {
			console.log(userId);

			return [];
		},
		async unlinkAccount(providerAccountId) {
			console.log(providerAccountId);
		},
		updateAuthenticatorCounter(credentialID, newCounter) {
			console.log(credentialID, newCounter);

			return {} as AdapterAuthenticator;
		},
		updateSession(session) {
			console.log(session);

			return session as AdapterSession;
		},
		updateUser(user) {
			console.log(user);

			return user as AdapterUser;
		},
		useVerificationToken(params) {
			console.log(params);

			return null;
		},
	};
}
