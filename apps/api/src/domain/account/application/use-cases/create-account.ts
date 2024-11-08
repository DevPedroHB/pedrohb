import { Either, success } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Injectable } from "@nestjs/common";
import { Account } from "../../enterprise/entities/account";
import { AccountsRepository } from "../repositories/accounts-repository";

interface CreateAccountUseCaseRequest {
	provider: string;
	providerAccountId: string;
	type: string;
	refreshToken?: string | null;
	accessToken?: string | null;
	expiresAt?: number | null;
	tokenType?: string | null;
	scope?: string | null;
	tokenId?: string | null;
	userId: string;
}

type CreateAccountUseCaseResponse = Either<
	null,
	{
		account: Account;
	}
>;

@Injectable()
export class CreateAccountUseCase {
	constructor(private accountsRepository: AccountsRepository) {}

	async execute({
		provider,
		providerAccountId,
		type,
		refreshToken,
		accessToken,
		expiresAt,
		tokenType,
		scope,
		tokenId,
		userId,
	}: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
		const account = Account.create({
			provider,
			providerAccountId,
			type,
			refreshToken,
			accessToken,
			expiresAt,
			tokenType,
			scope,
			tokenId,
			userId: new UniqueEntityID(userId),
		});

		await this.accountsRepository.create(account);

		return success({
			account,
		});
	}
}
