import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	type TVerificationTokenFields,
	VerificationTokensRepository,
} from "@/domain/account/application/repositories/verification-tokens-repository";
import { VerificationToken } from "@/domain/account/enterprise/entities/verification-token";

export class InMemoryVerificationTokensRepository
	implements VerificationTokensRepository
{
	public items: VerificationToken[] = [];

	private matchesFields(
		item: VerificationToken,
		fields: TVerificationTokenFields,
	) {
		return Object.entries(fields).every(([key, value]) => {
			if (item[key] instanceof UniqueEntityID) {
				return item[key].equals(new UniqueEntityID(String(value)));
			}

			return item[key] === value;
		});
	}

	async findByFields(fields: TVerificationTokenFields) {
		return this.items.find((item) => this.matchesFields(item, fields)) || null;
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
