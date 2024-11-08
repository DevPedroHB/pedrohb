import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { AccountAndUser } from "../../enterprise/entities/value-objects/account-and-user";
import { AccountsRepository } from "../repositories/accounts-repository";

interface GetUserByAccountUseCaseRequest {
	provider: string;
	providerAccountId: string;
}

type GetUserByAccountUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		accountAndUser: AccountAndUser;
	}
>;

@Injectable()
export class GetUserByAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute({
		provider,
		providerAccountId,
	}: GetUserByAccountUseCaseRequest): Promise<GetUserByAccountUseCaseResponse> {
		const accountAndUser = await this.accountsRepository.findByProviderId(
			provider,
			providerAccountId,
		);

		if (!accountAndUser) {
			return error(new ResourceNotFoundError("Conta"));
		}

		return success({
			accountAndUser,
		});
	}
}
