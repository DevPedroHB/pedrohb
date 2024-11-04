import type { TEntityFields } from "@/core/types/entity-fields";
import {
	type IVerificationToken,
	VerificationToken,
} from "../../enterprise/entities/verification-token";

export type TVerificationTokenFields = TEntityFields<IVerificationToken>;

export abstract class VerificationTokensRepository {
	abstract findByFields(
		fields: TVerificationTokenFields,
	): Promise<VerificationToken | null>;
	abstract create(token: VerificationToken): Promise<void>;
	abstract delete(token: VerificationToken): Promise<void>;
}
