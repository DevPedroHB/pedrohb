import { generateCacheKey } from "@/core/functions/generate-cache-key";
import {
	type TVerificationTokenFields,
	VerificationTokensRepository,
} from "@/domain/account/application/repositories/verification-tokens-repository";
import { VerificationToken } from "@/domain/account/enterprise/entities/verification-token";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaVerificationTokenMapper } from "../mappers/prisma-verification-token-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaVerificationTokensRepository
	implements VerificationTokensRepository
{
	constructor(
		private prisma: PrismaService,
		private cache: CacheRepository,
	) {}

	private async invalidateCache(verificationToken: VerificationToken) {
		const data = PrismaVerificationTokenMapper.toPrisma(verificationToken);

		await this.cache.delete("verificationTokens");

		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined && value !== null) {
				await this.cache.delete(`verificationToken:${key}:${value}`);
			}
		}
	}

	async findByFields(fields: TVerificationTokenFields) {
		const cacheKey = generateCacheKey("verificationToken", [fields]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return PrismaVerificationTokenMapper.toDomain(JSON.parse(cacheHit));
		}

		const verificationToken = await this.prisma.verificationToken.findFirst({
			where: fields,
		});

		if (!verificationToken) {
			return null;
		}

		await this.cache.set(cacheKey, JSON.stringify(verificationToken));

		return PrismaVerificationTokenMapper.toDomain(verificationToken);
	}

	async create(verificationToken: VerificationToken) {
		const data = PrismaVerificationTokenMapper.toPrisma(verificationToken);

		await Promise.all([
			this.prisma.verificationToken.create({
				data,
			}),

			this.invalidateCache(verificationToken),
		]);
	}

	async delete(verificationToken: VerificationToken) {
		await Promise.all([
			this.prisma.verificationToken.delete({
				where: {
					identifier_token: {
						identifier: verificationToken.identifier,
						token: verificationToken.token,
					},
				},
			}),

			this.invalidateCache(verificationToken),
		]);
	}
}
