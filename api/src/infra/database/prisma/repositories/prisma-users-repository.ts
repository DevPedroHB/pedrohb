import type { IPagination } from "@/core/types/pagination";
import { UsersRepository, type IUserFields } from "@/domain/account/application/repositories/users-repository";
import { User } from "@/domain/account/enterprise/entities/user";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
	constructor(
		private prisma: PrismaService,
		private cache: CacheRepository,
	) {}

  private async invalidateCache(user: User) {
    const data = PrismaUserMapper.toPrisma(user);

    await this.cache.delete("users");

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        await this.cache.delete(`user:${key}:${value}`);
      }
    }
  }


	async fetchUsers({ page, perPage }: IPagination) {
		const cacheKey = `users:page:${page}:perPage:${perPage}`;
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return JSON.parse(cacheHit).map(PrismaUserMapper.toDomain);
		}

		const users = await this.prisma.user.findMany({
			orderBy: {
				createdAt: "desc",
			},
			take: perPage,
			skip: (page - 1) * perPage,
		});

		await this.cache.set(cacheKey, JSON.stringify(users));

		return users.map(PrismaUserMapper.toDomain);
	}

  async findByFields(fields: IUserFields): Promise<User | null> {
    const cacheKey = `user:${Object.entries(fields)
      .map(([key, value]) => `${key}:${value}`)
      .join(",")}`;
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return PrismaUserMapper.toDomain(JSON.parse(cacheHit));
		}

    const user = await this.prisma.user.findFirst({
        where: {
            ...fields,
        },
    });

    if (!user) {
        return null;
    }

    await this.cache.set(cacheKey, JSON.stringify(user));

    return PrismaUserMapper.toDomain(user);
}

	async create(user: User) {
		const data = PrismaUserMapper.toPrisma(user);

		await this.prisma.user.create({
			data,
		});

		await this.invalidateCache(user);
	}

	async update(user: User) {
		const data = PrismaUserMapper.toPrisma(user);

		await this.prisma.user.update({
			where: {
				id: data.id,
			},
			data,
		});

		await this.invalidateCache(user);
	}

	async delete(user: User) {
		await this.prisma.user.delete({
			where: {
				id: user.id.id,
			},
		});

		await this.invalidateCache(user);
	}
}
