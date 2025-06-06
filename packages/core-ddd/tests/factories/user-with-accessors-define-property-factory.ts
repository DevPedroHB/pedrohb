import type { UUID } from "@/entities/unique-entity-ids/uuid";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { UserWithAccessorsDefineProperty } from "@tests/entities/user-with-accessors-define-property";
import type { IUser } from "@tests/types/user";

export function makeUserWithAccessorsDefineProperty(
	props: Partial<IUser> = {},
	id?: UUID,
) {
	const userWithAccessorsDefineProperty =
		UserWithAccessorsDefineProperty.create(
			{
				name: faker.person.fullName(),
				age: faker.number.int({ min: 1, max: 100 }),
				...props,
			},
			id,
		);

	return userWithAccessorsDefineProperty;
}
