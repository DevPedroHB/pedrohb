import type { UUID } from "@/entities/unique-entity-ids/uuid";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { UserEntity } from "@tests/entities/user-entity";
import type { IUser } from "@tests/types/user";

export function makeUserEntity(props: Partial<IUser> = {}, id?: UUID) {
	const userEntity = UserEntity.create(
		{
			name: faker.person.fullName(),
			age: faker.number.int({ min: 1, max: 100 }),
			...props,
		},
		id,
	);

	return userEntity;
}
