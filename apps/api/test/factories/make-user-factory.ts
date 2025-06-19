import { IUser, User } from "@/domain/account/enterprise/entities/user";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { UUID } from "@pedrohb/core-ddd";
import { Role } from "@pedrohb/db";

export function makeUser(override: Partial<IUser> = {}, id?: UUID) {
	const name = faker.person.fullName();

	const user = User.create(
		{
			name,
			email: faker.internet.email({
				firstName: name.split(" ")[0],
				lastName: name.split(" ")[1],
				allowSpecialCharacters: true,
			}),
			passwordHash: faker.internet.password(),
			avatarUrl: faker.image.avatar(),
			roles: [faker.helpers.enumValue(Role)],
			...override,
		},
		id,
	);

	user.verifyEmail();

	return user;
}
