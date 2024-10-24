import { Either, error, success } from "@/core/either";
import { AlreadyExistsError } from "@/core/errors/already-exists-error";
import { Injectable } from "@nestjs/common";
import { User } from "../../enterprise/entities/user";
import { EncrypterRepository } from "../cryptography/encrypter-repository";
import { HasherRepository } from "../cryptography/hasher-repository";
import { UsersRepository } from "../repositories/users-repository";

interface SignUpUseCaseRequest {
	name?: string | null;
	email: string;
	password?: string | null;
	avatarUrl?: string | null;
	birthdate?: Date | null;
	emailVerifiedAt?: Date | null;
}

type SignUpUseCaseResponse = Either<
	AlreadyExistsError,
	{
		user: User;
		token: string;
	}
>;

@Injectable()
export class SignUpUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private hasherRepository: HasherRepository,
		private encrypterRepository: EncrypterRepository,
	) {}

	async execute({
		name,
		email,
		password,
		avatarUrl,
		birthdate,
		emailVerifiedAt,
	}: SignUpUseCaseRequest): Promise<SignUpUseCaseResponse> {
		const userWithSameEmail = await this.usersRepository.findByFields({
			email,
		});

		if (userWithSameEmail) {
			return error(new AlreadyExistsError("User"));
		}

		const hashedPassword =
			password && (await this.hasherRepository.hash(password));

		const user = User.create({
			name,
			email,
			password: hashedPassword,
			avatarUrl,
			birthdate,
			emailVerifiedAt,
		});

		await this.usersRepository.create(user);

		const token = await this.encrypterRepository.encrypt({
			sub: user.id.id,
		});

		return success({
			user,
			token,
		});
	}
}
