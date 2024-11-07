import { generateCacheKey } from "@/core/functions/generate-cache-key";
import type { TFetchEntity } from "@/core/types/fetch-entity";
import {
	AuthenticatorsRepository,
	type TAuthenticatorFields,
} from "@/domain/account/application/repositories/authenticators-repository";
import { Authenticator } from "@/domain/account/enterprise/entities/authenticator";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaAuthenticatorMapper } from "../mappers/prisma-authenticator-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAuthenticatorsRepository
	implements AuthenticatorsRepository
{
	constructor(
		private prisma: PrismaService,
		private cache: CacheRepository,
	) {}

	private async invalidateCache(authenticator: Authenticator) {
		const data = PrismaAuthenticatorMapper.toPrisma(authenticator);

		await this.cache.delete("authenticators");

		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined && value !== null) {
				await this.cache.delete(`authenticator:${key}:${value}`);
			}
		}
	}

	async fetchAuthenticators({
		fields,
		orderBy,
		pagination,
	}: TFetchEntity<TAuthenticatorFields>) {
		const cacheKey = generateCacheKey("authenticators", [
			fields,
			orderBy,
			pagination,
		]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return JSON.parse(cacheHit).map(PrismaAuthenticatorMapper.toDomain);
		}

		const orderArray = orderBy
			? Object.entries(orderBy).map(([field, direction]) => ({
					[field]: direction,
				}))
			: undefined;

		const authenticators = await this.prisma.authenticator.findMany({
			where: fields,
			orderBy: orderArray,
			take: pagination?.perPage,
			skip: pagination ? (pagination.page - 1) * pagination.perPage : undefined,
		});

		await this.cache.set(cacheKey, JSON.stringify(authenticators));

		return authenticators.map(PrismaAuthenticatorMapper.toDomain);
	}

	async findByFields(fields: TAuthenticatorFields) {
		const cacheKey = generateCacheKey("authenticator", [fields]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return PrismaAuthenticatorMapper.toDomain(JSON.parse(cacheHit));
		}

		const authenticator = await this.prisma.authenticator.findFirst({
			where: fields,
		});

		if (!authenticator) {
			return null;
		}

		await this.cache.set(cacheKey, JSON.stringify(authenticator));

		return PrismaAuthenticatorMapper.toDomain(authenticator);
	}

	async create(authenticator: Authenticator) {
		const data = PrismaAuthenticatorMapper.toPrisma(authenticator);

		await Promise.all([
			this.prisma.authenticator.create({
				data,
			}),

			this.invalidateCache(authenticator),
		]);
	}

	async update(authenticator: Authenticator) {
		const data = PrismaAuthenticatorMapper.toPrisma(authenticator);

		await Promise.all([
			this.prisma.authenticator.update({
				where: {
					credentialId_userId: {
						credentialId: data.credentialId,
						userId: data.userId,
					},
				},
				data,
			}),

			this.invalidateCache(authenticator),
		]);
	}
}
