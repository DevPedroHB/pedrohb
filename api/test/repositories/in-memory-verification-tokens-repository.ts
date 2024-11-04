import { matchesFields } from "@/core/functions/matches-fields";
import {
	type TVerificationTokenFields,
	VerificationTokensRepository,
} from "@/domain/account/application/repositories/verification-tokens-repository";
import { VerificationToken } from "@/domain/account/enterprise/entities/verification-token";

export class InMemoryVerificationTokensRepository
	implements VerificationTokensRepository
{
	public items: VerificationToken[] = [];

	async findByFields(fields: TVerificationTokenFields) {
		return this.items.find((item) => matchesFields(item, fields)) || null;
	}

	async create(verificationToken: VerificationToken) {
		this.items.push(verificationToken);
	}

	async delete(verificationToken: VerificationToken) {
		const index = this.items.findIndex((item) =>
			item.equals(verificationToken),
		);

		if (index !== -1) {
			this.items.splice(index, 1);
		}
	}
}
