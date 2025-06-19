import {
	AlreadyExistsError,
	Either,
	InvalidCredentialsError,
	Password,
	UseCase,
	error,
	success,
} from "@pedrohb/core-ddd";
import { User } from "../../enterprise/entities/user";
import { UsersRepository } from "../repositories/users-repository";

export interface SignUpCredentialsUseCaseRequest {
	email: string;
	password: string;
	confirmPassword: string;
}

export type SignUpCredentialsUseCaseResponse = Either<
	AlreadyExistsError | InvalidCredentialsError,
	{
		user: User;
	}
>;

export class SignUpCredentialsUseCase extends UseCase<
	SignUpCredentialsUseCaseRequest,
	SignUpCredentialsUseCaseResponse
> {
	constructor(private readonly usersRepository: UsersRepository) {
		super();
	}

	public async execute({
		email,
		password,
		confirmPassword,
	}: SignUpCredentialsUseCaseRequest): Promise<SignUpCredentialsUseCaseResponse> {
		try {
			const userWithSameEmail = await this.usersRepository.findByFields({
				email,
			});

			if (userWithSameEmail) {
				throw new AlreadyExistsError();
			}

			if (password !== confirmPassword) {
				throw new InvalidCredentialsError();
			}

			const passwordHash = await Password.create(password);

			const user = User.create({
				email,
				passwordHash,
			});

			await this.usersRepository.create(user);

			return success({
				user,
			});
		} catch (err) {
			return error(err);
		}
	}
}
