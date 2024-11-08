import { Either, error, success } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { Account } from "../../enterprise/entities/account";
import { AccountsRepository } from "../repositories/accounts-repository";

interface DeleteAccountUseCaseRequest {
	provider: string;
	providerAccountId: string;
}

type DeleteAccountUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		account: Account;
	}
>;

@Injectable()
export class DeleteAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute({
		provider,
		providerAccountId,
	}: DeleteAccountUseCaseRequest): Promise<DeleteAccountUseCaseResponse> {
		const account = await this.accountsRepository.findByFields({
			provider,
			providerAccountId,
		});

		if (!account) {
			return error(new ResourceNotFoundError("Conta"));
		}

		await this.accountsRepository.delete(account);

		return success({
			account,
		});
	}
}
