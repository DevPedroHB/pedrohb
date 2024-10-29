import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface DeleteUserUseCaseRequest {
	userId: string;
}

type DeleteUserUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		user: User;
	}
>;

export class DeleteUserUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
		const user = await this.usersRepository.findByFields({ id: userId });

		if (!user) {
			return error(new ResourceNotFoundError("Usuário"));
		}

		await this.usersRepository.delete(user);

		return success({
			user,
		});
	}
}
