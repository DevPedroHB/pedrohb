import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface GetUserByEmailUseCaseRequest {
	email: string;
}

type GetUserByEmailUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		user: User;
	}
>;

export class GetUserByEmailUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		email,
	}: GetUserByEmailUseCaseRequest): Promise<GetUserByEmailUseCaseResponse> {
		const user = await this.usersRepository.findByFields({ email });

		if (!user) {
			return error(new ResourceNotFoundError("Usuário"));
		}

		return success({
			user,
		});
	}
}
