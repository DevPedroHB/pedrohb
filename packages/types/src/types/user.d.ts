export enum Roles {
	OWNER = "OWNER",
	CLIENT = "CLIENT",
	MEMBER = "MEMBER",
}

export interface User {
	id: string;
	name?: string | null;
	email: string;
	password?: string | null;
	avatarUrl?: string | null;
	birthdate?: Date | null;
	role: Roles;
	emailVerifiedAt?: Date | null;
	createdAt: Date;
	updatedAt?: Date | null;
}
