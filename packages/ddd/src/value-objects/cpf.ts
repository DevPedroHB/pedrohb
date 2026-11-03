import { type CpfGenerateOptions, cpf } from "cpf-cnpj-validator";
import { DDDError } from "#/errors/ddd-error.js";
import { ValueObject } from "./value-object.js";

export const CPF_FISCAL_REGION_BY_UF = cpf.FISCAL_REGION_BY_UF;

export type CPFProps = {
	cpf: string;
};

export class CPF extends ValueObject<CPFProps> {
	private constructor(props: CPFProps) {
		super(props);
	}

	public get cpf() {
		return this.props.cpf;
	}

	public toJSON() {
		return {
			cpf: this.cpf,
		};
	}

	public static format(value: string) {
		return cpf.format(value);
	}

	public static generate(options?: boolean | CpfGenerateOptions) {
		return cpf.generate(options);
	}

	public static isValid(value: string, strict?: boolean) {
		return cpf.isValid(value, strict);
	}

	public static strip(value: string, strict?: boolean) {
		return cpf.strip(value, strict);
	}

	public static verifierDigit(digits: string) {
		return cpf.verifierDigit(digits);
	}

	public static create(cpf = CPF.generate()) {
		if (!CPF.isValid(cpf)) {
			throw new DDDError("INVALID_CPF", {
				params: {
					cpf,
				},
				cause: cpf,
			});
		}

		return new CPF({
			cpf: CPF.format(cpf),
		});
	}
}
