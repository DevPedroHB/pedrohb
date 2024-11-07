import type { TPartialFactory } from "@/core/types/partial-factory";
import type { VerificationTokensRepository } from "@/domain/account/application/repositories/verification-tokens-repository";
import {
	type IVerificationToken,
	VerificationToken,
} from "@/domain/account/enterprise/entities/verification-token";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeVerificationToken(
	override: TPartialFactory<IVerificationToken> = {},
) {
	const token = VerificationToken.create(
		{
			identifier: faker.lorem.word(),
			...override,
		},
		override.id,
	);

	return token;
}

@Injectable()
export class VerificationTokenFactory {
	constructor(
		private verificationTokensRepository: VerificationTokensRepository,
	) {}

	async makeVerificationToken(data: TPartialFactory<IVerificationToken> = {}) {
		const verificationToken = makeVerificationToken(data);

		await this.verificationTokensRepository.create(verificationToken);

		return verificationToken;
	}
}
