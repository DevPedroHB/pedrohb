import { DomainEvents } from "@/core/events/domain-events";
import { generateCacheKey } from "@/core/functions/generate-cache-key";
import type { TQueryOptions } from "@/core/types/query-options";
import {
	type TUserFields,
	UsersRepository,
} from "@/domain/account/application/repositories/users-repository";
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

	async fetchUsers({
		fields,
		orderBy,
		pagination,
	}: TQueryOptions<TUserFields>) {
		const cacheKey = generateCacheKey("users", [fields, orderBy, pagination]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return JSON.parse(cacheHit).map(PrismaUserMapper.toDomain);
		}

		const orderArray = orderBy
			? Object.entries(orderBy).map(([field, direction]) => ({
					[field]: direction,
				}))
			: undefined;

		const users = await this.prisma.user.findMany({
			where: fields,
			orderBy: orderArray,
			take: pagination?.perPage,
			skip: pagination ? (pagination.page - 1) * pagination.perPage : undefined,
		});

		await this.cache.set(cacheKey, JSON.stringify(users));

		return users.map(PrismaUserMapper.toDomain);
	}

	async findByFields(fields: TUserFields) {
		const cacheKey = generateCacheKey("user", [fields]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return PrismaUserMapper.toDomain(JSON.parse(cacheHit));
		}

		const user = await this.prisma.user.findFirst({
			where: fields,
		});

		if (!user) {
			return null;
		}

		await this.cache.set(cacheKey, JSON.stringify(user));

		return PrismaUserMapper.toDomain(user);
	}

	async create(user: User) {
		const data = PrismaUserMapper.toPrisma(user);

		await Promise.all([
			this.prisma.user.create({
				data,
			}),

			this.invalidateCache(user),
		]);

		DomainEvents.dispatchEventsForAggregate(user.id);
	}

	async update(user: User) {
		const data = PrismaUserMapper.toPrisma(user);

		await Promise.all([
			this.prisma.user.update({
				where: {
					id: data.id,
				},
				data,
			}),

			this.invalidateCache(user),
		]);

		DomainEvents.dispatchEventsForAggregate(user.id);
	}

	async delete(user: User) {
		await Promise.all([
			this.prisma.user.delete({
				where: {
					id: user.id.id,
				},
			}),

			this.invalidateCache(user),
		]);

		DomainEvents.dispatchEventsForAggregate(user.id);
	}
}
