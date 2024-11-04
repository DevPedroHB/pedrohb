import type { TEntityFields } from "@/core/types/entity-fields";
import type { TFetchEntity } from "@/core/types/fetch-entity";
import {
	Authenticator,
	type IAuthenticator,
} from "../../enterprise/entities/authenticator";

export type TAuthenticatorFields = TEntityFields<IAuthenticator, "userId"> & {
	userId?: string;
};

export abstract class AuthenticatorsRepository {
	abstract fetchAuthenticators(
		options: TFetchEntity<TAuthenticatorFields>,
	): Promise<Authenticator[]>;
	abstract findByFields(
		fields: TAuthenticatorFields,
	): Promise<Authenticator | null>;
	abstract create(authenticator: Authenticator): Promise<void>;
	abstract update(authenticator: Authenticator): Promise<void>;
}
