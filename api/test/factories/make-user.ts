import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { type IUser, User } from "@/domain/account/enterprise/entities/user";
import { faker } from "@faker-js/faker";

export function makeUser(override: Partial<IUser> = {}, id?: UniqueEntityID) {
	const name = faker.person.fullName();

	const user = User.create(
		{
			name,
			email: faker.internet.email({
				firstName: name.split(" ")[0],
				lastName: name.split(" ")[1],
				allowSpecialCharacters: true,
			}),
			password: faker.internet.password(),
			avatarUrl: faker.image.avatar(),
			birthdate: faker.date.birthdate(),
			createdAt: faker.date.past(),
			...override,
		},
		id,
	);

	return user;
}
