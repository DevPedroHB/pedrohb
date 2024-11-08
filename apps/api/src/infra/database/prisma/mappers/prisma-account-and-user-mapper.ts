import { AccountAndUser } from "@/domain/account/enterprise/entities/value-objects/account-and-user";
import { Account as PrismaAccount, User as PrismaUser } from "@prisma/client";
import { PrismaAccountMapper } from "./prisma-account-mapper";
import { PrismaUserMapper } from "./prisma-user-mapper";

export type PrismaAccountAndUser = PrismaAccount & {
	user: PrismaUser;
};

export class PrismaAccountAndUserMapper {
	static toDomain(accountWithUser: PrismaAccountAndUser): AccountAndUser {
		return AccountAndUser.create({
      account: PrismaAccountMapper.toDomain(accountWithUser),
			user: PrismaUserMapper.toDomain(accountWithUser.user),
		});
	}
}
