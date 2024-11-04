import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { SessionWithUser } from "@/domain/account/enterprise/entities/value-objects/session-with-user";
import { Session as PrismaSession, User as PrismaUser } from "@prisma/client";
import { PrismaUserMapper } from "./prisma-user-mapper";

export type PrismaSessionWithUser = PrismaSession & {
	user: PrismaUser;
};

export class PrismaSessionWithUserMapper {
	static toDomain(sessionWithUser: PrismaSessionWithUser): SessionWithUser {
		return SessionWithUser.create({
			id: new UniqueEntityID(),
			sessionToken: sessionWithUser.sessionToken,
			expiresAt: sessionWithUser.expiresAt,
			createdAt: sessionWithUser.createdAt,
			updatedAt: sessionWithUser.updatedAt,
			user: PrismaUserMapper.toDomain(sessionWithUser.user),
		});
	}
}
