import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Roles, User } from "@/domain/account/enterprise/entities/user";
import {
  Prisma,
  Roles as PrismaRoles,
  User as PrismaUser,
} from "@prisma/client";

export class PrismaUserMapper {
	static toDomain(user: PrismaUser): User {
		return User.create(
			{
				name: user.name,
				email: user.email,
				password: user.password,
				avatarUrl: user.avatarUrl,
				birthdate: user.birthdate,
				role: Roles[user.role],
				emailVerifiedAt: user.emailVerifiedAt,
				createdAt: user.createdAt,
				updatedAt: user.updatedAt,
			},
			new UniqueEntityID(user.id),
		);
	}

	static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
		return {
			id: user.id.id,
			name: user.name,
			email: user.email,
			password: user.password,
			avatarUrl: user.avatarUrl,
			birthdate: user.birthdate,
			role: PrismaRoles[user.role],
			emailVerifiedAt: user.emailVerifiedAt,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}
