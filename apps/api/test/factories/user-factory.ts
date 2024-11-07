import type { TPartialFactory } from "@/core/types/partial-factory";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { type IUser, User } from "@/domain/account/enterprise/entities/user";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeUser(override: TPartialFactory<IUser> = {}) {
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
		override.id,
	);

	return user;
}

@Injectable()
export class UserFactory {
	constructor(private usersRepository: UsersRepository) {}

	async makeUser(data: TPartialFactory<IUser> = {}) {
		const user = makeUser(data);

		await this.usersRepository.create(user);

		return user;
	}
}
