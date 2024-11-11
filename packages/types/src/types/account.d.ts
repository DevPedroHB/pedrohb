export interface Account {
	provider: string;
	providerAccountId: string;
	type: string;
	refreshToken?: string | null;
	accessToken?: string | null;
	expiresAt?: number | null;
	tokenType?: string | null;
	scope?: string | null;
	tokenId?: string | null;
	sessionState?: string | null;
	createdAt: Date;
	updatedAt?: Date | null;
	userId: string;
}
