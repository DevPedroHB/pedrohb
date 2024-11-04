import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Session } from "@/domain/account/enterprise/entities/session";
import { Prisma, Session as PrismaSession } from "@prisma/client";

export class PrismaSessionMapper {
	static toDomain(session: PrismaSession): Session {
		return Session.create({
			sessionToken: session.sessionToken,
			expiresAt: session.expiresAt,
			createdAt: session.createdAt,
			updatedAt: session.updatedAt,
			userId: new UniqueEntityID(session.userId),
		});
	}

	static toPrisma(session: Session): Prisma.SessionUncheckedCreateInput {
		return {
			sessionToken: session.sessionToken,
			expiresAt: session.expiresAt,
			createdAt: session.createdAt,
			updatedAt: session.updatedAt,
			userId: session.userId.id,
		};
	}
}
