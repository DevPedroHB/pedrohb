import { Either, error, success } from "@/core/either";
import { NotAllowedError } from "@/core/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import type { TPartialExcept } from "@/core/types/partial-except";
import { Injectable } from "@nestjs/common";
import { type IUser, Roles, User } from "../../enterprise/entities/user";
import { HasherRepository } from "../cryptography/hasher-repository";
import { UsersRepository } from "../repositories/users-repository";

interface UpdateUserUseCaseRequest
	extends TPartialExcept<IUser, "createdAt" | "updatedAt"> {
	userId: string;
}

type UpdateUserUseCaseResponse = Either<
	ResourceNotFoundError | NotAllowedError,
	{
		user: User;
	}
>;

@Injectable()
export class UpdateUserUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private hasherRepository: HasherRepository,
	) {}

	async execute({
		userId,
		name,
		email,
		password,
		avatarUrl,
		birthdate,
		role,
		emailVerifiedAt,
	}: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
		const user = await this.usersRepository.findByFields({ id: userId });

		if (!user) {
			return error(new ResourceNotFoundError("Usuário"));
		}

		user.name = name;
		user.avatarUrl = avatarUrl;
		user.birthdate = birthdate;
		user.emailVerifiedAt = emailVerifiedAt;

		if (password !== undefined) {
			const hashedPassword = password
				? await this.hasherRepository.hash(password)
				: null;

			user.password = hashedPassword;
		}

		if (email === null) {
			return error(new NotAllowedError());
		}

		if (email !== undefined) {
			user.email = email;
		}

		if (role && role in Roles) {
			user.role = Roles[role];
		}

		await this.usersRepository.update(user);

		return success({
			user,
		});
	}
}
