import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface IAuthenticator {
	credentialId: string;
	providerAccountId: string;
	credentialPublicKey: string;
	counter: number;
	credentialDeviceType: string;
	credentialBackedUp: boolean;
	transports?: string | null;
	userId: UniqueEntityID;
}

export class Authenticator extends Entity<IAuthenticator> {
	get credentialId() {
		return this.props.credentialId;
	}

	get providerAccountId() {
		return this.props.providerAccountId;
	}

	get credentialPublicKey() {
		return this.props.credentialPublicKey;
	}

	get counter() {
		return this.props.counter;
	}

	get credentialDeviceType() {
		return this.props.credentialDeviceType;
	}

	get credentialBackedUp() {
		return this.props.credentialBackedUp;
	}

	get transports() {
		return this.props.transports;
	}

	get userId() {
		return this.props.userId;
	}

	static create(props: IAuthenticator, id?: UniqueEntityID) {
		const authenticator = new Authenticator(props, id);

		return authenticator;
	}
}
