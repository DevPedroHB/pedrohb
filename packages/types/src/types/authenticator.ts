export interface Authenticator {
	credentialId: string;
	providerAccountId: string;
	credentialPublicKey: string;
	counter: number;
	credentialDeviceType: string;
	credentialBackedUp: boolean;
	transports?: string | null;
	userId: string;
}
