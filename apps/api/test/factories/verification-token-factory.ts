import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { VerificationTokensRepository } from "@/domain/account/application/repositories/verification-tokens-repository";
import {
	type IVerificationToken,
	VerificationToken,
} from "@/domain/account/enterprise/entities/verification-token";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeVerificationToken(
	override: Partial<IVerificationToken> = {},
	id?: UniqueEntityID,
) {
	const verificationToken = VerificationToken.create(
		{
			identifier: faker.lorem.word(),
			...override,
		},
		id,
	);

	return verificationToken;
}

@Injectable()
export class VerificationTokenFactory {
	constructor(
		private verificationTokensRepository: VerificationTokensRepository,
	) {}

	async makeVerificationToken(
		data: Partial<IVerificationToken> = {},
		id?: UniqueEntityID,
	) {
		const verificationToken = makeVerificationToken(data, id);

		await this.verificationTokensRepository.create(verificationToken);

		return verificationToken;
	}
}
