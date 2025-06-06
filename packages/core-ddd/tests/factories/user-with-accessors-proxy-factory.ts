import type { UUID } from "@/entities/unique-entity-ids/uuid";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { UserWithAccessorsProxy } from "@tests/entities/user-with-accessors-proxy";
import type { IUser } from "@tests/types/user";

export function makeUserWithAccessorsProxy(
	props: Partial<IUser> = {},
	id?: UUID,
) {
	const userWithAccessorsProxy = UserWithAccessorsProxy.create(
		{
			name: faker.person.fullName(),
			age: faker.number.int({ min: 1, max: 100 }),
			...props,
		},
		id,
	);

	return userWithAccessorsProxy;
}
