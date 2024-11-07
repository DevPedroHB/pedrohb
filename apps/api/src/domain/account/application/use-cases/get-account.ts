import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Account } from "../../enterprise/entities/account";
import { AccountsRepository } from "../repositories/accounts-repository";

interface GetAccountUseCaseRequest {
	provider: string;
	providerAccountId: string;
}

type GetAccountUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		account: Account;
	}
>;

export class GetAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute({
		provider,
		providerAccountId,
	}: GetAccountUseCaseRequest): Promise<GetAccountUseCaseResponse> {
		const account = await this.accountsRepository.findByFields({
			provider,
			providerAccountId,
		});

		if (!account) {
			return error(new ResourceNotFoundError("Conta"));
		}

		return success({
			account,
		});
	}
}
