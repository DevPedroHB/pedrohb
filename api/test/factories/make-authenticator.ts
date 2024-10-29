import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	Authenticator,
	type IAuthenticator,
} from "@/domain/account/enterprise/entities/authenticator";
import { faker } from "@faker-js/faker";
import { makeUser } from "./make-user";

export function makeAuthenticator(
	override: Partial<IAuthenticator> = {},
	id?: UniqueEntityID,
) {
	const user = makeUser();

	const authenticator = Authenticator.create(
		{
			credentialId: faker.string.uuid(),
			providerAccountId: faker.string.uuid(),
			credentialPublicKey: faker.string.uuid(),
			counter: faker.number.int({ min: 1, max: 100 }),
			credentialDeviceType: faker.lorem.word(),
			credentialBackedUp: faker.datatype.boolean(),
			userId: user.id,
			...override,
		},
		id,
	);

	return {
		user,
		authenticator,
	};
}
