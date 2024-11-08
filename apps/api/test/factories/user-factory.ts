import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { UsersRepository } from "@/domain/account/application/repositories/users-repository";
import { type IUser, User } from "@/domain/account/enterprise/entities/user";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeUser(override: Partial<IUser> = {}, id?: UniqueEntityID) {
	const name = faker.person.fullName();

	const user = User.create(
		{
			name,
			email: faker.internet.email({
				firstName: name.split(" ")[0],
				lastName: name.split(" ")[1],
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

@Injectable()
export class UserFactory {
	constructor(private usersRepository: UsersRepository) {}

	async makeUser(data: Partial<IUser> = {}, id?: UniqueEntityID) {
		const user = makeUser(data, id);

		await this.usersRepository.create(user);

		return user;
	}
}
