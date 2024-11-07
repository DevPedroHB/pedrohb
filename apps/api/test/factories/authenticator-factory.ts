import type { TPartialFactory } from "@/core/types/partial-factory";
import { AuthenticatorsRepository } from "@/domain/account/application/repositories/authenticators-repository";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import {
	Authenticator,
	type IAuthenticator,
} from "@/domain/account/enterprise/entities/authenticator";
import type { IUser } from "@/domain/account/enterprise/entities/user";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { makeUser } from "./user-factory";

interface IAuthenticatorFactory {
	user?: TPartialFactory<IUser>;
	authenticator?: TPartialFactory<IAuthenticator>;
}

export function makeAuthenticator(
	override: IAuthenticatorFactory = { user: {}, authenticator: {} },
) {
	const user = makeUser(override.user);

	const authenticator = Authenticator.create(
		{
			credentialId: faker.string.uuid(),
			providerAccountId: faker.string.uuid(),
			credentialPublicKey: faker.string.uuid(),
			counter: faker.number.int({ min: 1, max: 100 }),
			credentialDeviceType: faker.lorem.word(),
			credentialBackedUp: faker.datatype.boolean(),
			userId: user.id,
			...override.authenticator,
		},
		override.authenticator.id,
	);

	return {
		user,
		authenticator,
	};
}

@Injectable()
export class AuthenticatorFactory {
	constructor(
		private usersRepository: UsersRepository,
		private authenticator: AuthenticatorsRepository,
	) {}

	async makeAuthenticator(
		data: IAuthenticatorFactory = { user: {}, authenticator: {} },
	) {
		const { user, authenticator } = makeAuthenticator(data);

		await this.usersRepository.create(user);
		await this.authenticator.create(authenticator);

		return {
			user,
			authenticator,
		};
	}
}
