import type { TLogicalFilter } from "@/core/types/logical-filter";
import {
	type IVerificationToken,
	VerificationToken,
} from "../../enterprise/entities/verification-token";

export type TVerificationTokenFields = TLogicalFilter<IVerificationToken>;

export abstract class VerificationTokensRepository {
	abstract findByFields(
		fields: TVerificationTokenFields,
	): Promise<VerificationToken | null>;
	abstract create(token: VerificationToken): Promise<void>;
	abstract delete(token: VerificationToken): Promise<void>;
}
