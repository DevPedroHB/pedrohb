import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Authenticator } from "@/domain/account/enterprise/entities/authenticator";
import { Prisma, Authenticator as PrismaAuthenticator } from "@prisma/client";

export class PrismaAuthenticatorMapper {
	static toDomain(authenticator: PrismaAuthenticator): Authenticator {
		return Authenticator.create({
			credentialId: authenticator.credentialId,
			providerAccountId: authenticator.providerAccountId,
			credentialPublicKey: authenticator.credentialPublicKey,
			counter: authenticator.counter,
			credentialDeviceType: authenticator.credentialDeviceType,
			credentialBackedUp: authenticator.credentialBackedUp,
			transports: authenticator.transports,
			userId: new UniqueEntityID(authenticator.userId),
		});
	}

	static toPrisma(
		authenticator: Authenticator,
	): Prisma.AuthenticatorUncheckedCreateInput {
		return {
			credentialId: authenticator.credentialId,
			providerAccountId: authenticator.providerAccountId,
			credentialPublicKey: authenticator.credentialPublicKey,
			counter: authenticator.counter,
			credentialDeviceType: authenticator.credentialDeviceType,
			credentialBackedUp: authenticator.credentialBackedUp,
			transports: authenticator.transports,
			userId: authenticator.userId.id,
		};
	}
}
