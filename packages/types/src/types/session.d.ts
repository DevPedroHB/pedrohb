export interface Session {
	sessionToken: string;
	expiresAt: Date;
	createdAt: Date;
	updatedAt?: Date | null;
	userId: string;
}
