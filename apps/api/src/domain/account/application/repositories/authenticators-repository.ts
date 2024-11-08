import type { TLogicalFilter } from "@/core/types/logical-filter";
import type { TQueryOptions } from "@/core/types/query-options";
import {
	Authenticator,
	type IAuthenticator,
} from "../../enterprise/entities/authenticator";

export type TAuthenticatorFields = TLogicalFilter<IAuthenticator, "userId"> & {
	userId?: string;
};

export abstract class AuthenticatorsRepository {
	abstract fetchAuthenticators(
		options: TQueryOptions<TAuthenticatorFields>,
	): Promise<Authenticator[]>;
	abstract findByFields(
		fields: TAuthenticatorFields,
	): Promise<Authenticator | null>;
	abstract create(authenticator: Authenticator): Promise<void>;
	abstract update(authenticator: Authenticator): Promise<void>;
}
