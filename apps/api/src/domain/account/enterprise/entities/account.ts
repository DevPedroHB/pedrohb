import { Entity, NullableToOptional, Optional, UUID } from "@pedrohb/core-ddd";
import { AccountProvider, Account as PrismaAccount } from "@pedrohb/db";

export interface IAccount
	extends NullableToOptional<Omit<PrismaAccount, "id" | "userId">> {
	userId: UUID;
}

export class Account extends Entity<IAccount> {
	get provider() {
		return this.props.provider;
	}

	set provider(provider: AccountProvider) {
		this.props.provider = provider;

		this.update();
	}

	get providerAccountId() {
		return this.props.providerAccountId;
	}

	set providerAccountId(providerAccountId: string) {
		this.props.providerAccountId = providerAccountId;

		this.update();
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get userId() {
		return this.props.userId;
	}

	set userId(userId: UUID) {
		this.props.userId = userId;
	}

	private update() {
		this.props.updatedAt = new Date();
	}

	public toObject() {
		return {
			id: this.id.toValue(),
			...this.props,
			userId: this.props.userId.toValue(),
		};
	}

	public static create(props: Optional<IAccount, "createdAt">, id?: UUID) {
		const account = new Account(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
			},
			id ?? UUID.create(),
		);

		return account;
	}
}
