import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

interface GetUserByIdUseCaseRequest {
	userId: string;
}

type GetUserByIdUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		user: User;
	}
>;

@Injectable()
export class GetUserByIdUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({
		userId,
	}: GetUserByIdUseCaseRequest): Promise<GetUserByIdUseCaseResponse> {
		const user = await this.usersRepository.findByFields({ id: userId });

		if (!user) {
			return error(new ResourceNotFoundError("Usuário"));
		}

		return success({
			user,
		});
	}
}
