import { SessionAndUser } from "@/domain/account/enterprise/entities/value-objects/session-and-user";
import { Session as PrismaSession, User as PrismaUser } from "@prisma/client";
import { PrismaSessionMapper } from "./prisma-session.mapper";
import { PrismaUserMapper } from "./prisma-user-mapper";

export type PrismaSessionAndUser = PrismaSession & {
	user: PrismaUser;
};

export class PrismaSessionAndUserMapper {
	static toDomain(sessionAndUser: PrismaSessionAndUser): SessionAndUser {
		return SessionAndUser.create({
			session: PrismaSessionMapper.toDomain(sessionAndUser),
			user: PrismaUserMapper.toDomain(sessionAndUser.user),
		});
	}
}
