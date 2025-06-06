import type { UUID } from "@/entities/unique-entity-ids/uuid";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { UserAggregate } from "@tests/entities/user-aggregate";
import type { IUser } from "@tests/types/user";

export function makeUserAggregate(props: Partial<IUser> = {}, id?: UUID) {
	const userAggregate = UserAggregate.create(
		{
			name: faker.person.fullName(),
			age: faker.number.int({ min: 1, max: 100 }),
			...props,
		},
		id,
	);

	return userAggregate;
}
