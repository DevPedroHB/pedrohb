import { generateCacheKey } from "@/core/functions/generate-cache-key";
import {
	SessionsRepository,
	type TSessionFields,
} from "@/domain/account/application/repositories/sessions-repository";
import { Session } from "@/domain/account/enterprise/entities/session";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { Injectable } from "@nestjs/common";
import { PrismaSessionAndUserMapper } from "../mappers/prisma-session-and-user-mapper";
import { PrismaSessionMapper } from "../mappers/prisma-session.mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaSessionsRepository implements SessionsRepository {
	constructor(
		private prisma: PrismaService,
		private cache: CacheRepository,
	) {}

	private async invalidateCache(session: Session) {
		const data = PrismaSessionMapper.toPrisma(session);

		await this.cache.delete("sessions");

		for (const [key, value] of Object.entries(data)) {
			if (value !== undefined && value !== null) {
				await this.cache.delete(`session:${key}:${value}`);
			}
		}
	}

	async findByFields(fields: TSessionFields) {
		const cacheKey = generateCacheKey("session", [fields]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return PrismaSessionMapper.toDomain(JSON.parse(cacheHit));
		}

		const session = await this.prisma.session.findFirst({
			where: fields,
		});

		if (!session) {
			return null;
		}

		await this.cache.set(cacheKey, JSON.stringify(session));

		return PrismaSessionMapper.toDomain(session);
	}

	async create(session: Session) {
		const data = PrismaSessionMapper.toPrisma(session);

		await Promise.all([
			this.prisma.session.create({
				data,
			}),

			this.invalidateCache(session),
		]);
	}

	async update(session: Session) {
		const data = PrismaSessionMapper.toPrisma(session);

		await Promise.all([
			this.prisma.session.update({
				where: {
					sessionToken: data.sessionToken,
				},
				data,
			}),

			this.invalidateCache(session),
		]);
	}

	async delete(session: Session) {
		await Promise.all([
			this.prisma.session.delete({
				where: {
					sessionToken: session.sessionToken,
				},
			}),

			this.invalidateCache(session),
		]);
	}

	async findSessionByToken(sessionToken: string) {
		const cacheKey = generateCacheKey("session", [{ sessionToken }]);
		const cacheHit = await this.cache.get(cacheKey);

		if (cacheHit) {
			return PrismaSessionAndUserMapper.toDomain(JSON.parse(cacheHit));
		}

		const sessionWithUser = await this.prisma.session.findUnique({
			where: {
				sessionToken,
			},
			include: {
				user: true,
			},
		});

		if (!sessionWithUser) {
			return null;
		}

		await this.cache.set(cacheKey, JSON.stringify(sessionWithUser));

		return PrismaSessionAndUserMapper.toDomain(sessionWithUser);
	}
}
