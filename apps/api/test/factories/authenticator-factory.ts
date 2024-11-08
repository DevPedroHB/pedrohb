import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AuthenticatorsRepository } from "@/domain/account/application/repositories/authenticators-repository";
import {
	Authenticator,
	type IAuthenticator,
} from "@/domain/account/enterprise/entities/authenticator";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAuthenticator(
	override: Partial<IAuthenticator> = {},
	id?: UniqueEntityID,
) {
	const authenticator = Authenticator.create(
		{
			credentialId: faker.string.uuid(),
			providerAccountId: faker.string.uuid(),
			credentialPublicKey: faker.string.uuid(),
			counter: faker.number.int({ min: 1, max: 100 }),
			credentialDeviceType: faker.lorem.word(),
			credentialBackedUp: faker.datatype.boolean(),
			userId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return authenticator;
}

@Injectable()
export class AuthenticatorFactory {
	constructor(private authenticatorsRepository: AuthenticatorsRepository) {}

	async makeAuthenticator(
		data: Partial<IAuthenticator> = {},
		id?: UniqueEntityID,
	) {
		const authenticator = makeAuthenticator(data, id);

		await this.authenticatorsRepository.create(authenticator);

		return authenticator;
	}
}
