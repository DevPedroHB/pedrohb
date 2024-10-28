import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AccountWithUser } from "../../enterprise/entities/value-objects/account-with-user";
import { AccountsRepository } from "../repositories/accounts-repository";

interface GetUserByAccountUseCaseRequest {
	providerAccountId: string;
}

type GetUserByAccountUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		account: AccountWithUser;
	}
>;

export class GetUserByAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute({
		providerAccountId,
	}: GetUserByAccountUseCaseRequest): Promise<GetUserByAccountUseCaseResponse> {
		const account =
			await this.accountsRepository.findByProviderId(providerAccountId);

		if (!account) {
			return error(new ResourceNotFoundError("Conta"));
		}

		return success({
			account,
		});
	}
}