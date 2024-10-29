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

	set credentialId(credentialId: string) {
		this.props.credentialId = credentialId;
	}

	get providerAccountId() {
		return this.props.providerAccountId;
	}

	set providerAccountId(providerAccountId: string) {
		this.props.providerAccountId = providerAccountId;
	}

	get credentialPublicKey() {
		return this.props.credentialPublicKey;
	}

	set credentialPublicKey(credentialPublicKey: string) {
		this.props.credentialPublicKey = credentialPublicKey;
	}

	get counter() {
		return this.props.counter;
	}

	set counter(counter: number) {
		this.props.counter = counter;
	}

	get credentialDeviceType() {
		return this.props.credentialDeviceType;
	}

	set credentialDeviceType(credentialDeviceType: string) {
		this.props.credentialDeviceType = credentialDeviceType;
	}

	get credentialBackedUp() {
		return this.props.credentialBackedUp;
	}

	set credentialBackedUp(credentialBackedUp: boolean) {
		this.props.credentialBackedUp = credentialBackedUp;
	}

	get transports() {
		return this.props.transports;
	}

	set transports(transports: string | null | undefined) {
		if (transports !== undefined) {
			this.props.transports = transports;
		}
	}

	get userId() {
		return this.props.userId;
	}

	set userId(userId: UniqueEntityID) {
		this.props.userId = userId;
	}

	static create(props: IAuthenticator, id?: UniqueEntityID) {
		const authenticator = new Authenticator(props, id);

		return authenticator;
	}
}
